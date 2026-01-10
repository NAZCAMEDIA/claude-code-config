#!/bin/bash

# Status Line for Claude Code - Enhanced with Style, Model, Branch, Last Commit, and Context Usage
# Format: CTO | Opus-4.5 | main | d7afe84 docs: Add Taskosaur... | Ctx: 45% | user@host:dir time

# Read JSON input
input=$(cat)

# Extract data from JSON
current_dir=$(echo "$input" | jq -r '.workspace.current_dir // "unknown"')
output_style=$(echo "$input" | jq -r '.output_style.name // "default"')
model_id=$(echo "$input" | jq -r '.model.id // "unknown"')

# Context window data
total_input=$(echo "$input" | jq -r '.context_window.total_input_tokens // 0')
total_output=$(echo "$input" | jq -r '.context_window.total_output_tokens // 0')
context_size=$(echo "$input" | jq -r '.context_window.context_window_size // 200000')

# Get system information
username=$(whoami)
hostname=$(hostname -s)
current_time=$(date '+%H:%M:%S')

# Convert directory to home-relative path
relative_to_home=${current_dir/#$HOME/\~}

# Format output style name (convert to uppercase abbreviation)
style_display="DEFAULT"
if [[ "$output_style" == *"cto"* ]] || [[ "$output_style" == *"CTO"* ]]; then
    style_display="CTO"
elif [[ "$output_style" == *"explanatory"* ]]; then
    style_display="EXPLAIN"
elif [[ "$output_style" == *"learning"* ]]; then
    style_display="LEARN"
else
    # Take first 7 chars and uppercase
    style_display=$(echo "$output_style" | tr '[:lower:]' '[:upper:]' | cut -c1-7)
fi

# Format model name (e.g., claude-opus-4-5-20251101 -> Opus-4.5)
model_display="Unknown"
if [[ "$model_id" == *"opus-4"* ]]; then
    model_display="Opus-4.5"
elif [[ "$model_id" == *"sonnet-4"* ]]; then
    model_display="Sonnet-4.5"
elif [[ "$model_id" == *"sonnet-3-7"* ]]; then
    model_display="Sonnet-3.7"
elif [[ "$model_id" == *"sonnet-3-5"* ]]; then
    model_display="Sonnet-3.5"
elif [[ "$model_id" == *"haiku"* ]]; then
    model_display="Haiku"
fi

# Get git branch and last commit (if in a git repo)
git_branch=""
git_last_commit=""
if [ -d "$current_dir/.git" ] || git -C "$current_dir" rev-parse --git-dir > /dev/null 2>&1; then
    git_branch=$(git -C "$current_dir" rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [ -z "$git_branch" ]; then
        git_branch="(no branch)"
    fi
    # Get last commit (short hash + first 50 chars of message)
    git_last_commit=$(git -C "$current_dir" log -1 --pretty=format:"%h %s" 2>/dev/null | cut -c1-60)
fi

# Calculate context usage percentage (with validation and limits)
context_pct=0
context_color="${green}"  # Default: green
context_indicator=""       # Indicator bar

# Compaction detection: store previous total tokens to detect resets
state_file="/tmp/claude_statusline_state.txt"
previous_total=0
if [ -f "$state_file" ]; then
    previous_total=$(cat "$state_file" 2>/dev/null || echo 0)
fi

if [[ "$context_size" =~ ^[0-9]+$ ]] && [ "$context_size" -gt 0 ]; then
    total_input=${total_input:-0}
    total_output=${total_output:-0}
    total_tokens=$((total_input + total_output))

    # Detect compaction: if current tokens dropped significantly (>50%), reset to 0
    if [ "$previous_total" -gt 0 ] && [ "$total_tokens" -lt $((previous_total / 2)) ]; then
        # Compaction detected - force reset visual to 0%
        context_pct=0
        context_indicator="✓ COMPACTED"
    else
        context_pct=$((total_tokens * 100 / context_size))

        # Cap at 100% but show if it exceeds
        if [ "$context_pct" -gt 100 ]; then
            context_pct=100
            context_indicator="⚠️ COMPACTING"
        fi
    fi

    # Save current total for next execution
    echo "$total_tokens" > "$state_file"

    # Dynamic color coding based on usage threshold
    # Green: 1-79% | Orange: 80-89% | Red: 90-99% | Critical: 100%
    if [ "$context_pct" -ge 90 ]; then
        if [ "$context_pct" -ge 100 ]; then
            context_color="${red}🚨"  # Critical - auto-compacting
        else
            context_color="${red}"    # Red: 90-99%
        fi
    elif [ "$context_pct" -ge 80 ]; then
        context_color="${orange}"    # Orange: 80-89%
    else
        context_color="${green}"     # Green: 1-79%
    fi

    # Generate visual progress bar (10 characters)
    # Example: [████░░░░░░] 40%
    bar_length=10
    filled=$((context_pct * bar_length / 100))
    empty=$((bar_length - filled))

    context_bar="["
    i=0
    while [ $i -lt $filled ]; do
        context_bar="${context_bar}█"
        i=$((i + 1))
    done
    i=0
    while [ $i -lt $empty ]; do
        context_bar="${context_bar}░"
        i=$((i + 1))
    done
    context_bar="${context_bar}]"
fi

# ANSI color codes for terminal
cyan='\033[0;36m'
yellow='\033[0;33m'
green='\033[0;32m'
orange='\033[0;33m'  # Yellow/Orange
blue='\033[0;34m'
magenta='\033[0;35m'
red='\033[0;31m'
reset='\033[0m'

# Build enhanced status line
# Format: CTO | Opus-4.5 | main | d7afe84 docs: Add Taskosaur... | Ctx: 45% | user@host:dir time
if [ -n "$git_branch" ]; then
    if [ -n "$git_last_commit" ]; then
        # With git branch and commit
        printf "${blue}%s${reset} ${magenta}|${reset} ${yellow}%s${reset} ${magenta}|${reset} ${green}%s${reset} ${magenta}|${reset} ${cyan}%s${reset} ${magenta}|${reset} Ctx: %s ${context_color}%d%%${reset} ${magenta}|${reset} ${cyan}%s@%s${reset}:${yellow}%s${reset} ${green}%s${reset}" \
            "$style_display" \
            "$model_display" \
            "$git_branch" \
            "$git_last_commit" \
            "$context_bar" \
            "$context_pct" \
            "$username" \
            "$hostname" \
            "$relative_to_home" \
            "$current_time"
    else
        # With git branch but no commit
        printf "${blue}%s${reset} ${magenta}|${reset} ${yellow}%s${reset} ${magenta}|${reset} ${green}%s${reset} ${magenta}|${reset} Ctx: %s ${context_color}%d%%${reset} ${magenta}|${reset} ${cyan}%s@%s${reset}:${yellow}%s${reset} ${green}%s${reset}" \
            "$style_display" \
            "$model_display" \
            "$git_branch" \
            "$context_bar" \
            "$context_pct" \
            "$username" \
            "$hostname" \
            "$relative_to_home" \
            "$current_time"
    fi
else
    # No git branch - simpler format
    printf "${blue}%s${reset} ${magenta}|${reset} ${yellow}%s${reset} ${magenta}|${reset} Ctx: %s ${context_color}%d%%${reset} ${magenta}|${reset} ${cyan}%s@%s${reset}:${yellow}%s${reset} ${green}%s${reset}" \
        "$style_display" \
        "$model_display" \
        "$context_bar" \
        "$context_pct" \
        "$username" \
        "$hostname" \
        "$relative_to_home" \
        "$current_time"
fi