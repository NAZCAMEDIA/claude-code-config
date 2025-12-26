#!/bin/bash

# Status Line for Claude Code - Enhanced with Style, Model, Branch, and Context Usage
# Format: CTO | Opus-4.5 | main | Ctx: 45% | user@host:dir time

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

# Get git branch (if in a git repo)
git_branch=""
if [ -d "$current_dir/.git" ] || git -C "$current_dir" rev-parse --git-dir > /dev/null 2>&1; then
    git_branch=$(git -C "$current_dir" rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [ -z "$git_branch" ]; then
        git_branch="(no branch)"
    fi
fi

# Calculate context usage percentage
if [ "$context_size" -gt 0 ]; then
    total_tokens=$((total_input + total_output))
    context_pct=$((total_tokens * 100 / context_size))
else
    context_pct=0
fi

# ANSI color codes for terminal
cyan='\033[0;36m'
yellow='\033[0;33m'
green='\033[0;32m'
blue='\033[0;34m'
magenta='\033[0;35m'
red='\033[0;31m'
reset='\033[0m'

# Build enhanced status line
# Format: CTO | Opus-4.5 | main | Ctx: 45% | user@host:dir time
if [ -n "$git_branch" ]; then
    printf "${blue}%s${reset} ${magenta}|${reset} ${yellow}%s${reset} ${magenta}|${reset} ${green}%s${reset} ${magenta}|${reset} Ctx: ${yellow}%d%%${reset} ${magenta}|${reset} ${cyan}%s@%s${reset}:${yellow}%s${reset} ${green}%s${reset}" \
        "$style_display" \
        "$model_display" \
        "$git_branch" \
        "$context_pct" \
        "$username" \
        "$hostname" \
        "$relative_to_home" \
        "$current_time"
else
    # No git branch - simpler format
    printf "${blue}%s${reset} ${magenta}|${reset} ${yellow}%s${reset} ${magenta}|${reset} Ctx: ${yellow}%d%%${reset} ${magenta}|${reset} ${cyan}%s@%s${reset}:${yellow}%s${reset} ${green}%s${reset}" \
        "$style_display" \
        "$model_display" \
        "$context_pct" \
        "$username" \
        "$hostname" \
        "$relative_to_home" \
        "$current_time"
fi