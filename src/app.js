// DIN-A4 horizontal
const y1 = 20;
const y2 = 190;
const x1 = 50;
const x2 = 297 - 20;

/**
 * right aligned text
 */
function createRText(x, y, text) {
    return $(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
        .attr({x, y, 'text-anchor': 'end'})
        .append(document.createTextNode(text));
}

/**
 * centered text
 */
function createMText(x, y, text) {
    return $(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
        .attr({x, y, 'text-anchor': 'middle '})
        .append(document.createTextNode(text));
}

function createLine(x1, y1, x2, y2, clazz) {
    return $(document.createElementNS('http://www.w3.org/2000/svg', 'line'))
        .attr({x1, x2, y1, y2, class: clazz});
}

function createLineRel(x1, y1, w, l, clazz) {
    return createLine(x1, y1, x1 + w, y1 + l, clazz)
}

function createYScale(startValue, step, x) {
    const $g = $('#graph');

    const ySize = (y2 - 8) - y1;
    const yStep = ySize / 50;
    $g.append(createLine(x + 2, y1, x + 2, (y2 - 8)));

    let v = startValue;
    for (let i = 0; i <= 50; ++i) {
        const y = y1 + (yStep * (50 - i));
        $g.append(createLineRel(x, y, 2, 0, 'minor'));
        $g.append(createRText(x - 1, y + 0.75, v.toFixed(1).toString()))
        v += step;
    }
}

function createGrid() {
    const xStart = 50;
    const $g = $('#graph');
    const ySteps = Math.ceil(10 / 0.2);
    const ySize = (y2 - 8) - y1;
    const yStep = ySize / ySteps;
    for (let i = 0; i <= ySteps; ++i) {
        const y = y1 + (yStep * (ySteps - i));
        $g.append(createLine(50, y, x2, y, (i % 5) === 0 ? 'major' : 'minor'));
    }

    const xSize = x2 - xStart;
    const xStep = xSize / 30;
    for (let i = 0; i <= 30; ++i) {
        const x = xStart + (i * xStep);
        $g.append(createLine(x, y1, x, (y2 - 8), (i === 0 | i === 30) ? 'major' : 'minor'));

        $g.append(createLine(x, y2 - 5, x, y2 - 3, 'minor'));
        $g.append(createMText(x, y2, (i + 1).toString()));
    }

    $g.append(createLine(50, y2 - 5, x2, y2 - 5, 'minor'));
}

function readUrlParamFloat(name) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(name)) {
        try {
            return parseFloat(urlParams.get(name));
        } catch (e) {
            console.error(`could not read URL-param '${name}'`)
        }
    }
    return null;
}

$(() => {
    $('.mdc-text-field').each((i, el) => new mdc.textField.MDCTextField(el));

    $('.w-start input').val(readUrlParamFloat('wStart') || 75);
    $('.w-step input').val(readUrlParamFloat('wStep') || 0.2);
    $('.f-start input').val(readUrlParamFloat('fStart') || 20);
    $('.f-step input').val(readUrlParamFloat('fStep') || 0.2);

    createYScale(readUrlParamFloat('wStart') || 90, readUrlParamFloat('wStep') || 0.2, 32);
    createYScale(readUrlParamFloat('fStart') || 25, readUrlParamFloat('fStep') || 0.1, 45);
    createGrid();
})

