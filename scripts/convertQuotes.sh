#!/bin/bash

# convertQuotes.sh - Script to convert quotes from quotesToConvert.txt to JavaScript array format

# Set script directory and file paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
QUOTES_FILE="$SCRIPT_DIR/quotesToConvert.txt"
OUTPUT_FILE="$SCRIPT_DIR/preQuotes.ts"

# Check if the quotes file exists
if [[ ! -f "$QUOTES_FILE" ]]; then
    echo "Error: quotesToConvert.txt not found in scripts directory"
    exit 1
fi

echo "Converting quotes from $QUOTES_FILE to $OUTPUT_FILE..."

# Initialize the output file with the array declaration
echo "const quotes = [" > "$OUTPUT_FILE"

# Read the file line by line and process in groups of 3
quote=""
author=""
line_count=0

while IFS= read -r line || [[ -n "$line" ]]; do
    case $((line_count % 3)) in
        0) # Quote line
            quote="$line"
            ;;
        1) # Author line
            author="$line"
            ;;
        2) # Blank line - process the quote/author pair
            if [[ -n "$quote" && -n "$author" ]]; then
                # Escape backticks and backslashes in the quote and author
                escaped_quote=$(echo "$quote" | sed 's/`/\\`/g' | sed 's/\\/\\\\/g')
                escaped_author=$(echo "$author" | sed 's/`/\\`/g' | sed 's/\\/\\\\/g')
                
                # Add the quote object to the array
                echo "  {quote: \`$escaped_quote\`, author: \`$escaped_author\`}," >> "$OUTPUT_FILE"
            fi
            quote=""
            author=""
            ;;
    esac
    ((line_count++))
done < "$QUOTES_FILE"

# Handle the last quote if the file doesn't end with a blank line
if [[ -n "$quote" && -n "$author" ]]; then
    escaped_quote=$(echo "$quote" | sed 's/`/\\`/g' | sed 's/\\/\\\\/g')
    escaped_author=$(echo "$author" | sed 's/`/\\`/g' | sed 's/\\/\\\\/g')
    echo "  {quote: \`$escaped_quote\`, author: \`$escaped_author\`}," >> "$OUTPUT_FILE"
fi

# Close the array and add export
echo "];" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "export default quotes;" >> "$OUTPUT_FILE"

echo "Conversion completed! Generated $(grep -c "quote:" "$OUTPUT_FILE") quotes in $OUTPUT_FILE"
