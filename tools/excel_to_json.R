#!/usr/bin/env Rscript
#
# Convert Excel/CSV data files to JSON for the Patrice Mirindi website
#

# Load required libraries
suppressPackageStartupMessages({
  library(readxl)
  library(jsonlite)
})

# Function to convert FAQ data
convert_faq_data <- function() {
  tryCatch({
    # Try to read Excel first, then CSV as fallback
    if (file.exists("data/faq.xlsx")) {
      df <- read_excel("data/faq.xlsx")
      cat("Loaded FAQ data from Excel file\n")
    } else if (file.exists("data/faq.csv")) {
      df <- read.csv("data/faq.csv", stringsAsFactors = FALSE)
      cat("Loaded FAQ data from CSV file\n")
    } else {
      cat("No FAQ data file found, skipping...\n")
      return()
    }

    # Convert to list format for JSON
    faq_data <- list()
    for (i in 1:nrow(df)) {
      keywords <- if (!is.na(df$Keywords[i])) {
        trimws(strsplit(df$Keywords[i], ",")[[1]])
      } else {
        character(0)
      }

      faq_item <- list(
        id = i,
        question = trimws(as.character(df$Question[i])),
        keywords = keywords,
        answer = trimws(as.character(df$Answer[i])),
        category = if (!is.na(df$Category[i])) trimws(as.character(df$Category[i])) else "General"
      )
      faq_data[[i]] <- faq_item
    }

    # Create output directory
    dir.create("docs/data", recursive = TRUE, showWarnings = FALSE)

    # Save to JSON
    write_json(faq_data, "docs/data/faq.json", pretty = TRUE, auto_unbox = TRUE)

    cat("Converted", length(faq_data), "FAQ entries to JSON\n")

  }, error = function(e) {
    cat("Error converting FAQ data:", e$message, "\n")
  })
}

# Function to copy JSON files
copy_json_files <- function() {
  tryCatch({
    # Create destination directory
    dir.create("docs/data", recursive = TRUE, showWarnings = FALSE)

    json_files <- c("about.json", "work_experience.json", "skills_expertise.json", "key_projects.json")

    for (json_file in json_files) {
      source_path <- file.path("data", json_file)
      dest_path <- file.path("docs/data", json_file)

      if (file.exists(source_path)) {
        # Read and rewrite to ensure proper formatting
        data <- fromJSON(source_path)
        write_json(data, dest_path, pretty = TRUE, auto_unbox = TRUE)
        cat("Copied", json_file, "to docs/data/\n")
      } else {
        cat("Warning:", json_file, "not found in data directory\n")
      }
    }

  }, error = function(e) {
    cat("Error copying JSON files:", e$message, "\n")
  })
}

# Main function
main <- function() {
  cat("Starting data conversion process...\n")

  # Convert FAQ data if it exists
  convert_faq_data()

  # Copy other JSON data files
  copy_json_files()

  cat("Data conversion completed!\n")
}

# Run main function
main()
