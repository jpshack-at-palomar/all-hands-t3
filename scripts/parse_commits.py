#!/usr/bin/env python3
import re
import subprocess
from datetime import datetime, timezone, timedelta
import sys

def get_git_log_data():
    """Execute git log command to get all commits across all branches"""
    try:
        # Use a different separator that's less likely to appear in commit messages
        # Removed --no-merges to include merge commits
        cmd = ["git", "log", "--all", "--pretty=format:%H∞%ai∞%s∞%D", "--name-only"]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running git command: {e}")
        return ""

def parse_timestamp(timestamp_str):
    """Parse timestamp with timezone and convert to UTC"""
    timestamp_str = timestamp_str.strip()
    
    # Parse the full timestamp with timezone
    try:
        # Git uses ISO format like "2025-07-29 22:19:01 -0400"
        if ' +' in timestamp_str or ' -' in timestamp_str:
            # Split at the last space to separate timezone
            dt_part, tz_part = timestamp_str.rsplit(' ', 1)
            
            # Parse the datetime part
            dt = datetime.fromisoformat(dt_part)
            
            # Parse timezone offset
            if tz_part.startswith('+'):
                sign = 1
                tz_str = tz_part[1:]
            else:  # starts with '-'
                sign = -1
                tz_str = tz_part[1:]
            
            # Parse HHMM format
            hours = int(tz_str[:2])
            minutes = int(tz_str[2:])
            
            # Create timezone offset
            offset_minutes = sign * (hours * 60 + minutes)
            tz = timezone(timedelta(minutes=offset_minutes))
            
            # Apply timezone and convert to UTC
            dt_with_tz = dt.replace(tzinfo=tz)
            dt_utc = dt_with_tz.astimezone(timezone.utc)
            
            return dt_utc.replace(tzinfo=None)  # Return naive UTC datetime
        else:
            # No timezone, assume UTC
            return datetime.fromisoformat(timestamp_str)
            
    except Exception as e:
        print(f"Error parsing timestamp '{timestamp_str}': {e}")
        return None

def extract_branch_from_refs(refs_str):
    """Extract branch name from git refs, with improved logic"""
    if not refs_str:
        return None  # Return None instead of defaulting to main
    
    refs_str = refs_str.strip()
    if "HEAD -> " in refs_str:
        # Extract the current branch after HEAD -> 
        match = re.search(r'HEAD -> ([^,\s]+)', refs_str)
        if match:
            return match.group(1)
    
    # Look for feature branch patterns first (not main/master)
    if "origin/" in refs_str:
        matches = re.findall(r'origin/([^,\s]+)', refs_str)
        for branch in matches:
            if branch not in ["HEAD", "main", "master"]:
                return branch
    
    # Look for local branch names (without origin/)
    parts = [p.strip() for p in refs_str.split(',')]
    for part in parts:
        if not part.startswith('origin/') and part not in ['refs/stash', '', 'main', 'master']:
            return part
    
    # Finally, check for main/master
    if "origin/main" in refs_str or "main" in refs_str:
        return "main"
    if "origin/master" in refs_str or "master" in refs_str:
        return "master"
    
    return None

def extract_branch_from_merge_message(message):
    """Extract branch name from merge commit message"""
    # Pattern: "Merge pull request #N from user/branch-name"
    match = re.search(r'Merge pull request #\d+ from [^/]+/(.+)', message)
    if match:
        return match.group(1).strip()
    
    # Pattern: "Merge branch 'branch-name'"
    match = re.search(r"Merge branch '([^']+)'", message)
    if match:
        return match.group(1).strip()
    
    return None

def determine_commit_branches(commits):
    """Determine the original branch for each commit using merge analysis"""
    # Sort commits by timestamp (oldest first)
    sorted_commits = sorted(commits, key=lambda x: x['timestamp'])
    
    # First pass: identify merge commits and extract branch info
    merge_branches = {}
    branch_periods = []
    
    for commit in sorted_commits:
        if commit['message'].startswith('Merge') or '[MERGE]' in commit.get('type', ''):
            branch = extract_branch_from_merge_message(commit['message'])
            if branch:
                merge_branches[commit['hash']] = {
                    'branch': branch,
                    'timestamp': commit['timestamp'],
                    'message': commit['message']
                }
                # Record when this branch was merged
                branch_periods.append({
                    'branch': branch,
                    'merge_time': commit['timestamp'],
                    'merge_hash': commit['hash']
                })
    
    # Sort branch periods by merge time
    branch_periods.sort(key=lambda x: x['merge_time'])
    
    # Second pass: assign branches to commits
    for commit in sorted_commits:
        # If this commit has explicit branch refs, use them
        refs_branch = extract_branch_from_refs(commit.get('refs', ''))
        if refs_branch:
            commit['branch'] = refs_branch
            continue
        
        # If this is a merge commit, it goes to main
        if commit['hash'] in merge_branches:
            commit['branch'] = "main"
            continue
        
        # For other commits, determine branch by looking at which branch period they fall into
        commit_time = commit['timestamp']
        assigned_branch = "main"  # default
        
        # Find the branch that this commit most likely belongs to
        for period in branch_periods:
            merge_time = period['merge_time']
            branch_name = period['branch']
            
            # Skip cursor branches and other non-project branches
            if 'cursor/' in branch_name or 'integrate-checklists' in branch_name:
                continue
            
            # If commit is within 2 hours before this merge, likely belongs to this branch
            time_diff = merge_time - commit_time
            if 0 <= time_diff.total_seconds() <= 2 * 3600:  # 2 hours
                assigned_branch = branch_name
                break
        
        commit['branch'] = assigned_branch

def parse_commits():
    git_log_data = get_git_log_data()
    if not git_log_data:
        return []
        
    commits = []
    lines = git_log_data.strip().split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
            
        # Check if this line has the commit format (hash∞timestamp∞message∞refs)
        if '∞' in line:
            parts = line.split('∞')
            if len(parts) >= 3:
                hash_val = parts[0]
                timestamp_str = parts[1] 
                message = parts[2]
                refs = parts[3] if len(parts) > 3 else ""
                
                # Parse timestamp
                timestamp = parse_timestamp(timestamp_str)
                if timestamp is None:
                    i += 1
                    continue
                
                # Collect files (lines after the commit line until next commit or end)
                files = []
                i += 1
                while i < len(lines):
                    next_line = lines[i].strip()
                    if not next_line:
                        i += 1
                        continue
                    # Check if this is another commit line
                    if '∞' in next_line and len(next_line.split('∞')[0]) == 40:  # 40 char hash
                        break
                    files.append(next_line)
                    i += 1
                
                commits.append({
                    'hash': hash_val,
                    'timestamp': timestamp,
                    'message': message,
                    'refs': refs,
                    'files': files
                })
            else:
                i += 1
        else:
            i += 1
    
    # Determine branches for all commits
    determine_commit_branches(commits)
    
    return commits

def format_timeline():
    commits = parse_commits()
    
    # Sort by timestamp (oldest first)
    commits.sort(key=lambda x: x['timestamp'])
    
    if not commits:
        return "No commits found"
    
    # Start time is the first commit
    start_time = commits[0]['timestamp']
    
    result = []
    prev_time = start_time
    
    for commit in commits:
        # Calculate time from start
        time_diff = commit['timestamp'] - start_time
        hours = int(time_diff.total_seconds() // 3600)
        minutes = int((time_diff.total_seconds() % 3600) // 60)
        
        # Calculate delta from previous commit
        delta_diff = commit['timestamp'] - prev_time
        delta_hours = int(delta_diff.total_seconds() // 3600) 
        delta_minutes = int((delta_diff.total_seconds() % 3600) // 60)
        
        # Format time string
        if commit == commits[0]:
            time_str = "time: 00:00"
        else:
            delta_total_minutes = delta_hours * 60 + delta_minutes
            time_str = f"time: {hours:02d}:{minutes:02d}  (+{delta_total_minutes} mins)"
        
        # Detect if this is a merge commit
        is_merge = commit['message'].startswith('Merge') or 'merge' in commit['message'].lower()
        commit_type = " [MERGE]" if is_merge else ""
        
        # Build commit entry
        entry = [
            time_str,
            f"commit: {commit['hash']}{commit_type}",
            f"branch: {commit['branch']}",
            "",
            commit['message'],
            ""
        ]
        
        # Add files
        for file in commit['files']:
            entry.append(f"  {file}")
        
        entry.append("")  # Empty line after each commit
        
        result.extend(entry)
        prev_time = commit['timestamp']
    
    return '\n'.join(result)

def main():
    timeline = format_timeline()
    
    # Write to file instead of printing to console
    output_file = "commit-timeline.txt"
    with open(output_file, 'w') as f:
        f.write(timeline)
    
    print(f"Timeline written to {output_file}")

if __name__ == "__main__":
    main()
