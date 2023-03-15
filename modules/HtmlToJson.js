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

export { toJSON, toHTML};