export function reload(arr, place, Component) {
    place.innerHTML = "";

    arr.forEach(item => {
        const elem = Component(item);
        place.append(elem);
    });
}