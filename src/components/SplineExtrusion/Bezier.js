import * as THREE from 'three'

export class OrientedPoint{

    position = new THREE.Vector3()
    quaternion = new THREE.Quaternion()

    constructor(pos = new THREE.Vector3(), quat = new THREE.Quaternion()){
        this.position = pos
        this.quaternion = quat
    }

    localToWorld(localSpacePos = new THREE.Vector3()) {
        
        const newPosition = new THREE.Vector3().copy(localSpacePos)
        newPosition.applyQuaternion(this.quaternion)
        newPosition.add(this.position)

        return newPosition;
    }

    localToWorldDirection(localSpacePos = new THREE.Vector3()) {
        
        const newPosition = new THREE.Vector3().copy(localSpacePos)
        newPosition.applyQuaternion(this.quaternion)

        return newPosition;
    }
}

export const getBezierPoint = (points, t) =>{

    const [p0, p1, p2, p3] = points

    const a = new THREE.Vector3().lerpVectors(p0, p1, t);
    const b = new THREE.Vector3().lerpVectors(p1, p2, t);
    const c = new THREE.Vector3().lerpVectors(p2, p3, t);
    const d = new THREE.Vector3().lerpVectors(a, b, t);
    const e = new THREE.Vector3().lerpVectors(b, c, t);
    
    const dummy = new THREE.Object3D()
    const pos = new THREE.Vector3().lerpVectors(d, e, t)
    const tangent = new THREE.Vector3().subVectors(e, d).normalize()
    dummy.lookAt(tangent)

    return new OrientedPoint(pos, dummy.quaternion);
}

export const getBezierLength = (points, precision = 8) =>{

    const approxPoints = []
    let dist = 0

    for (let i = 0; i < precision; i++) {
        let t = i / (precision - 1.0)
        approxPoints[i] = getBezierPoint(points, t)   
    }

    for (let i = 0; i < precision-1; i++) {
        const a = approxPoints[i].position
        const b = approxPoints[i + 1].position

        dist += a.distanceTo(b)
    }

    return dist
}

