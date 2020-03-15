function f(x){
    return x * 2;
}

const methods = {
    'leftRectangles': (a, b, N) => {
        const h = (b - a) / N;
        let s = 0;
        for(let i = 1; i < N; ++i){
            s += f(a + h * i);
        }
        return s * h;
    },
    'trapz': (a, b, N) =>  {
        const h = (b - a) / N;
        let s = f(a) + f(b);
        for (let i = 1; i < N; ++i){
            s += 2 * f(a + i * h);
        }
        return (h / 2) * s
    }
}

function calcArea(a, b, options){
    const {epsilon, N, method} = options;
    if (!(method in methods))
        throw new Error('No such method bla bla bla')
    if (epsilon){
        return calcAreaWithEpsilon(a, b, method, epsilon);
    }
    else if (N)
        return methods[method](a, b, N);
    throw new Error('Either epsilon or N should be provided bla bla bla')
}

function calcAreaWithEpsilon(a, b, method, epsilon){
    method = methods[method];
    let N = 2;
    let I2 = method(a, b, N);
    let I1 = I2 + 2 * epsilon;
    while(Math.abs(I2 - I1) > epsilon){
        I1 = I2;
        N = N * 2;
        I2 = method(a, b, N);
    }
    return I2;
}

console.log(calcArea(0, 5, {N: 100, method: 'leftRectangles'}))
console.log(calcArea(0, 5, {N: 100, method: 'trapz'}))