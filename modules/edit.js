
function goToEnd(El)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();
        range.selectNodeContents(El);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();
        range.moveToElementText(El);
        range.collapse(false);
        range.select();
    }
}

export {goToEnd}