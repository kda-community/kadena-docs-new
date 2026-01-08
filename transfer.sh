#!/bin/bash

# This script copies the builtins documentation from the kadena-io/pact-5 repository
# Run with `bash transfer.sh`

# Path Variables
REPO_URL="https://github.com/kadena-io/pact-5.git"
TEMP_DIR="temp-pact-5"
DOCS_DIR="docs/pact-5"
BUILTINS_DIR="docs/builtins"

# Clone the remote repository to a temporary directory
echo "Cloning kadena-io/pact-5 repository..."
git clone --depth=1 $REPO_URL $TEMP_DIR

# Check if the clone was successful
if [ $? -ne 0 ]; then
    echo "Failed to clone repository. Exiting."
    exit 1
fi

# Create the target directory if it doesn't exist
mkdir -p $DOCS_DIR

# Copy the builtins directory to the Docusaurus docs/pact-5 folder
echo "Copying builtins files into $DOCS_DIR..."
cp -r $TEMP_DIR/$BUILTINS_DIR/* $DOCS_DIR/

# Convert all files and directories to lowercase
echo "Converting file and directory names to lowercase..."
find $DOCS_DIR -depth | while read path; do
    lowercase_path=$(echo "$path" | awk '{print tolower($0)}')
    if [ "$path" != "$lowercase_path" ]; then
        mv "$path" "$lowercase_path"
    fi
done

# Find all markdown files and change lines that start with ### to ## if not the first line
echo "Updating markdown files..."
find $DOCS_DIR -name "*.md" | while read -r file; do
    # change line 1 from ## to #
    tmp=$(mktemp)
    sed '1s/^##/#/' "$file" > "$tmp" && mv "$tmp" "$file"

    # change lines 2 to end from ### to ##
    tmp=$(mktemp)
    sed '2,$s/^###/##/' "$file" > "$tmp" && mv "$tmp" "$file"
done

# Clean up
echo "Cleaning up..."
rm -rf $TEMP_DIR

echo "Done! The builtins files have been merged into $DOCS_DIR, converted to lowercase, and all headings have been updated."