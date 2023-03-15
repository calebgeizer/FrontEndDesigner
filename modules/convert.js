function toJSON(html){
    // Get the inner HTML of the body element
    let contents = html.innerHTML;

    // Create an object to store the body content
    let bodyObj = { html: contents };

    // Convert the object to JSON
    return JSON.stringify(bodyObj);
}

function toHTML(content){
    let contents = JSON.parse(content);

    // Access the "body" property of the parsed object
    const bodyHtml = contents.body;
    
    // Return InnerHTML
    return bodyHtml;
}

function saveHTML() {
  // Get the HTML content of the whole document
  const html = document.documentElement.outerHTML;

  // Create a blob from the HTML content
  const blob = new Blob([html], {type: 'text/html'});

  // Create a download link
  const link = document.createElement('a');
  link.download = 'index.html';
  link.href = URL.createObjectURL(blob);

  // Click the link to start the download
  link.click();
}

export { toJSON, toHTML, saveHTML }; 