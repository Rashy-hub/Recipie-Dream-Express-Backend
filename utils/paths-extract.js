function extractPaths(data) {
    const paths = []
    for (const item of data) {
        const route = item.route
        if (route && route.path) {
            const routeMethods = Object.keys(route.methods).join(', ').toUpperCase()
            paths.push(routeMethods + ' ' + route.path)
        }
    }
    return paths
}

export default extractPaths
