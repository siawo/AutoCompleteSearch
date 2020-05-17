export default (ele, atStart = true) => {
    if (window.getSelection &&
            document.createRange) {
        var range = document.createRange();
        range.selectNodeContents(ele);
        range.collapse(atStart);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(ele);
        textRange.collapse(atStart);
        textRange.select();
    }
  }