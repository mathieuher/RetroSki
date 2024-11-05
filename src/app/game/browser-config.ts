window.oncontextmenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
}