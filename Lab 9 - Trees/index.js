class Leaf {
    constructor(value, children) {
        this.value = value;
        this.children = children;
    }
}

const treeForBfs = new Leaf(1, [
    new Leaf(2, [
        new Leaf(5, [
            new Leaf(9, null),
            new Leaf(10, null)
        ]),
        new Leaf(6, null)
    ]),
    new Leaf(3, null),
    new Leaf(4, [
        new Leaf(7, [
            new Leaf(11, null),
            new Leaf(12, null)
        ]),
        new Leaf(8, null)
    ]),
]);

const treeForDfs = new Leaf(1, [
    new Leaf(2, [
        new Leaf(3, [
            new Leaf(4, null),
            new Leaf(5, null),
        ]),
        new Leaf(6, null),
    ]),
    new Leaf(7, null),
    new Leaf(8, [
        new Leaf(9, [
            new Leaf(10, null),
            new Leaf(11, null),
        ]),
        new Leaf(12, null),
    ])
])

function bfs(node) {
    let queue = [];
    let explored = new Set();

    queue.unshift(node);
    explored.add(node);

    while (queue.length) {
        let current = queue.pop();

        console.log('>> ', current.value)

        current.children && current.children
            .filter(n => !explored.has(n))
            .forEach(n => {
                explored.add(n);
                queue.unshift(n);
            });
    }
}

function dfs(node) {
    console.log('>> ', node.value);
    if (node.children) {
        node.children.forEach(dfs);
    }
}

console.log('BFS: ');
bfs(treeForBfs);
console.log('DFS: ');
dfs(treeForDfs);