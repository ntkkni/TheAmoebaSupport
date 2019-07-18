function trimAnyChar(str, anyChar) {
    return str.replace(new RegExp("^" + anyChar + "+|" + anyChar + "+$", "g"),'');
}
