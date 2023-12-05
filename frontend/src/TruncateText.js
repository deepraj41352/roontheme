const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  } else {
    // If the text exceeds the maxLength, truncate and append "..."
    return text.slice(0, maxLength) + '...';
  }
};

export default truncateText;
