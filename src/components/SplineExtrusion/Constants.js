const fenceTopProps = {
    scale: [0.015, 0.03],
    offset: [1.90, 0.55, 0]
}

const fenceBottomProps = {
    scale: [0.015, 0.03],
    offset: [1.90, 0.4, 0]
}

const fencePostsProps = {
    scale: [0.2,0.2,0.2],
    offset: [1.95,0.15,0],
    materialProps:
    {
    color: '#A1662F'
    }
}

const treeBottomProps = {
    scale: [0.5,0.5,0.5],
    offset: [2.5,0.3,0],
    materialProps:
    {
    color: "#E77F40"
    }
    
}

const treeTopProps = {
    scale: [0.5,0.5,0.5],
    offset: [2.5,0.3,0],
    materialProps:
        {
        color: '#50E700'
        }
}

const hydrantProps = {
    scale: [0.075,0.075,0.075],
    offset: [1.5,0.3,0],
    materialProps:
    {
    color: 'red',
    metalness: 0.5,
    roughness: 1.0,
    }
}

export {fenceBottomProps, fenceTopProps, fencePostsProps, treeBottomProps, treeTopProps, hydrantProps}