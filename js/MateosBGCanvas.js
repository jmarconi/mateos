var MateosBgCanvas = {
    aSin: [],
    p1: 0,
    p3: 0,

    init: function () {
        let i = 512;
        while (i--) {
            let rad = (i * 0.703125) * 0.0174532;
            this.aSin[i] = Math.sin(rad) * 1024;
        }
    },

    execute: function () {
        this.init();
        this.draw();
    },

    draw: function () {
        let p2 = 0;
        let p4 = 0;
        let t1 = null;
        let t2 = null;
        let t3 = null;
        let t4 = null;
        let ti = 1;
        let j = null;
        let x = null;
        let idx = null;
        let as = 2.6;
        let fd = 0.4;
        let as1 = 4.4;
        let fd1 = 2.2;
        let ps = -4.4;
        let ps2 = 3.3;


        const canvas = document.getElementById("canvas-background");
        canvas.width = 640;
        canvas.height = 320;
        let cv = canvas.getContext('2d');

        let cd = cv.createImageData(canvas.width, canvas.height);
        let cdData = cd.data;

        t4 = p4;
        t3 = MateosBgCanvas.p3;

        let i = 640;

        while (i--) {
            t1 = MateosBgCanvas.p1 + 5;
            t2 = p2 + 3;

            t3 &= 511;
            t4 &= 511;

            let j = 320;
            while (j--) {
                t1 &= 511;
                t2 &= 511;

                x = MateosBgCanvas.aSin[t1] + MateosBgCanvas.aSin[t2] + MateosBgCanvas.aSin[t3] + MateosBgCanvas.aSin[t4];

                idx = (i + j * canvas.width) * 4;

                cdData[idx + 0] = x / as;
                cdData[idx + 1] = x / fd;
                cdData[idx + 2] = x / ps;
                cdData[idx + 3] = 255;

                t1 += 5;
                t2 += 3;
            }

            t4 += as1;
            t3 += fd1;
        }

        cd.data.set(cdData);


        cv.putImageData(cd, 0, 0);

        MateosBgCanvas.p1 += ps;
        MateosBgCanvas.p3 += ps2;

        setTimeout(MateosBgCanvas.draw, ti);
    }
};

window.MateosBgCanvas = MateosBgCanvas;
