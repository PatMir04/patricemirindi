# Load Required Libraries
library(readxl)
library(jsonlite)
library(dplyr)

# Function to convert Excel to JSON
excel_to_json <- function(excel_file = "data/faq.xlsx", json_file = "data/faq.json") {
  # Read Excel file
  if (file.exists(excel_file)) {
    faq_data <- readxl::read_excel(excel_file)
  } else {
    # Fallback to CSV if Excel not found
    csv_file <- "data/faq.csv"
    if (file.exists(csv_file)) {
      faq_data <- read.csv(csv_file, stringsAsFactors = FALSE)
    } else {
      stop("Neither Excel nor CSV file found!")
    }
  }

  # Clean column names if needed
  colnames(faq_data) <- c("question", "keywords", "answer")

  # Convert to JSON format
  faq_json <- list()
  for (i in 1:nrow(faq_data)) {
    faq_json[[i]] <- list(
      id = i,
      question = faq_data$question[i],
      keywords = strsplit(faq_data$keywords[i], ",")[[1]],
      answer = faq_data$answer[i],
      category = "general"
    )
  }

  # Save as JSON
  write(jsonlite::toJSON(faq_json, pretty = TRUE, auto_unbox = TRUE), json_file)
  cat("FAQ data converted and saved to", json_file, "\n")
}

# Run conversion
if (!interactive()) {
  excel_to_json()
}
