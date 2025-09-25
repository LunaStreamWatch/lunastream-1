import { parse } from '@babel/parser';
import MagicString from 'magic-string';
import { walk } from 'estree-walker';
import path from 'path';

/* ───────────────────────────────────────────── Blacklists */
const threeFiberElems = [
    "object3D",
    "audioListener",
    "positionalAudio",
    "mesh",
    "batchedMesh",
    "instancedMesh",
    "scene",
    "sprite",
    "lOD",
    "skinnedMesh",
    "skeleton",
    "bone",
    "lineSegments",
    "lineLoop",
    "points",
    "group",
    "camera",
    "perspectiveCamera",
    "orthographicCamera",
    "cubeCamera",
    "arrayCamera",
    "instancedBufferGeometry",
    "bufferGeometry",
    "boxBufferGeometry",
    "circleBufferGeometry",
    "coneBufferGeometry",
    "cylinderBufferGeometry",
    "dodecahedronBufferGeometry",
    "extrudeBufferGeometry",
    "icosahedronBufferGeometry",
    "latheBufferGeometry",
    "octahedronBufferGeometry",
    "planeBufferGeometry",
    "polyhedronBufferGeometry",
    "ringBufferGeometry",
    "shapeBufferGeometry",
    "sphereBufferGeometry",
    "tetrahedronBufferGeometry",
    "torusBufferGeometry",
    "torusKnotBufferGeometry",
    "tubeBufferGeometry",
    "wireframeGeometry",
    "tetrahedronGeometry",
    "octahedronGeometry",
    "icosahedronGeometry",
    "dodecahedronGeometry",
    "polyhedronGeometry",
    "tubeGeometry",
    "torusKnotGeometry",
    "torusGeometry",
    "sphereGeometry",
    "ringGeometry",
    "planeGeometry",
    "latheGeometry",
    "shapeGeometry",
    "extrudeGeometry",
    "edgesGeometry",
    "coneGeometry",
    "cylinderGeometry",
    "circleGeometry",
    "boxGeometry",
    "capsuleGeometry",
    "material",
    "shadowMaterial",
    "spriteMaterial",
    "rawShaderMaterial",
    "shaderMaterial",
    "pointsMaterial",
    "meshPhysicalMaterial",
    "meshStandardMaterial",
    "meshPhongMaterial",
    "meshToonMaterial",
    "meshNormalMaterial",
    "meshLambertMaterial",
    "meshDepthMaterial",
    "meshDistanceMaterial",
    "meshBasicMaterial",
    "meshMatcapMaterial",
    "lineDashedMaterial",
    "lineBasicMaterial",
    "primitive",
    "light",
    "spotLightShadow",
    "spotLight",
    "pointLight",
    "rectAreaLight",
    "hemisphereLight",
    "directionalLightShadow",
    "directionalLight",
    "ambientLight",
    "lightShadow",
    "ambientLightProbe",
    "hemisphereLightProbe",
    "lightProbe",
    "spotLightHelper",
    "skeletonHelper",
    "pointLightHelper",
    "hemisphereLightHelper",
    "gridHelper",
    "polarGridHelper",
    "directionalLightHelper",
    "cameraHelper",
    "boxHelper",
    "box3Helper",
    "planeHelper",
    "arrowHelper",
    "axesHelper",
    "texture",
    "videoTexture",
    "dataTexture",
    "dataTexture3D",
    "compressedTexture",
    "cubeTexture",
    "canvasTexture",
    "depthTexture",
    "raycaster",
    "vector2",
    "vector3",
    "vector4",
    "euler",
    "matrix3",
    "matrix4",
    "quaternion",
    "bufferAttribute",
    "float16BufferAttribute",
    "float32BufferAttribute",
    "float64BufferAttribute",
    "int8BufferAttribute",
    "int16BufferAttribute",
    "int32BufferAttribute",
    "uint8BufferAttribute",
    "uint16BufferAttribute",
    "uint32BufferAttribute",
    "instancedBufferAttribute",
    "color",
    "fog",
    "fogExp2",
    "shape",
    "colorShiftMaterial"
];

const dreiElems = [
    "AsciiRenderer",
    "Billboard",
    "Clone",
    "ComputedAttribute",
    "Decal",
    "Edges",
    "Effects",
    "GradientTexture",
    "MarchingCubes",
    "Outlines",
    "PositionalAudio",
    "Sampler",
    "ScreenSizer",
    "ScreenSpace",
    "Splat",
    "Svg",
    "Text",
    "Text3D",
    "Trail",
    "CubeCamera",
    "OrthographicCamera",
    "PerspectiveCamera",
    "CameraControls",
    "FaceControls",
    "KeyboardControls",
    "MotionPathControls",
    "PresentationControls",
    "ScrollControls",
    "DragControls",
    "GizmoHelper",
    "Grid",
    "Helper",
    "PivotControls",
    "TransformControls",
    "CubeTexture",
    "Fbx",
    "Gltf",
    "Ktx2",
    "Loader",
    "Progress",
    "ScreenVideoTexture",
    "Texture",
    "TrailTexture",
    "VideoTexture",
    "WebcamVideoTexture",
    "CycleRaycast",
    "DetectGPU",
    "Example",
    "FaceLandmarker",
    "Fbo",
    "Html",
    "Select",
    "SpriteAnimator",
    "StatsGl",
    "Stats",
    "Trail",
    "Wireframe",
    "CurveModifier",
    "AdaptiveDpr",
    "AdaptiveEvents",
    "BakeShadows",
    "Bvh",
    "Detailed",
    "Instances",
    "Merged",
    "meshBounds",
    "PerformanceMonitor",
    "Points",
    "Preload",
    "Segments",
    "Fisheye",
    "Hud",
    "Mask",
    "MeshPortalMaterial",
    "RenderCubeTexture",
    "RenderTexture",
    "View",
    "MeshDiscardMaterial",
    "MeshDistortMaterial",
    "MeshReflectorMaterial",
    "MeshRefractionMaterial",
    "MeshTransmissionMaterial",
    "MeshWobbleMaterial",
    "PointMaterial",
    "shaderMaterial",
    "SoftShadows",
    "CatmullRomLine",
    "CubicBezierLine",
    "Facemesh",
    "Line",
    "Mesh",
    "QuadraticBezierLine",
    "RoundedBox",
    "ScreenQuad",
    "AccumulativeShadows",
    "Backdrop",
    "BBAnchor",
    "Bounds",
    "CameraShake",
    "Caustics",
    "Center",
    "Cloud",
    "ContactShadows",
    "Environment",
    "Float",
    "Lightformer",
    "MatcapTexture",
    "NormalTexture",
    "RandomizedLight",
    "Resize",
    "ShadowAlpha",
    "Shadow",
    "Sky",
    "Sparkles",
    "SpotLightShadow",
    "SpotLight",
    "Stage",
    "Stars",
    "OrbitControls"
];

const shouldTag = (name) => !threeFiberElems.includes(name) && !dreiElems.includes(name);

// ➕ Collect aliases of the Next.js <Image> component so we can reliably tag it even if it was renamed.
const isNextImageAlias = (aliases, name) => aliases.has(name);

const extractLiteralValue = (node) => {
    if (!node) return undefined;
    switch (node.type) {
        case 'StringLiteral':
            return node.value;
        case 'NumericLiteral':
            return node.value;
        case 'BooleanLiteral':
            return node.value;
        case 'ObjectExpression':
            const obj = {};
            for (const prop of node.properties) {
                if (prop.type === 'ObjectProperty' && !prop.computed) {
                    const key = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
                    obj[key] = extractLiteralValue(prop.value);
                }
            }
            return obj;
        case 'ArrayExpression':
            return node.elements.map((el) => extractLiteralValue(el));
        default:
            return undefined;
    }
};

const findVariableDeclarations = (ast) => {
    const variables = new Map();
    walk(ast, {
        enter(node) {
            // Handle const/let/var declarations
            if (node.type === 'VariableDeclaration') {
                for (const declarator of node.declarations) {
                    if (declarator.id.type === 'Identifier' && declarator.init) {
                        const varName = declarator.id.name;
                        const value = extractLiteralValue(declarator.init);
                        variables.set(varName, {
                            name: varName,
                            type: Array.isArray(value) ? 'array' : typeof value === 'object' ? 'object' : 'primitive',
                            value,
                            arrayItems: Array.isArray(value) ? value : undefined,
                            loc: declarator.loc?.start
                        });
                    }
                }
            }
        }
    });
    return variables;
};

const findMapContext = (node, variables) => {
    // Walk up the tree to find if this JSX element is inside a map call
    let current = node;
    let depth = 0;
    const maxDepth = 10; // Prevent infinite loops
    
    while (current && depth < maxDepth) {
        if (current.type === 'CallExpression' &&
            current.callee?.type === 'MemberExpression' &&
            current.callee?.property?.name === 'map') {
            // Found a .map() call, check if it's on a known array
            const arrayName = current.callee.object?.name;
            const mapCallback = current.arguments?.[0];
            
            if (arrayName && mapCallback?.type === 'ArrowFunctionExpression') {
                const itemParam = mapCallback.params?.[0];
                const indexParam = mapCallback.params?.[1];
                
                if (itemParam?.type === 'Identifier') {
                    const varInfo = variables.get(arrayName);
                    return {
                        arrayName,
                        itemVarName: itemParam.name,
                        arrayItems: varInfo?.arrayItems,
                        arrayLoc: varInfo?.loc,
                        indexVarName: indexParam?.type === 'Identifier' ? indexParam.name : undefined
                    };
                }
            }
        }
        current = current.parent;
        depth++;
    }
    
    return null;
};

const getSemanticName = (node, mapContext, imageAliases) => {
    const getName = () => {
        if (node.name.type === 'JSXIdentifier') return node.name.name;
        if (node.name.type === 'JSXMemberExpression') 
            return `${node.name.object.name}.${node.name.property.name}`;
        return null;
    };
    
    const tagName = getName();
    if (!tagName) return null;
    
    // For Next.js Image components, always return 'img' so the name is a valid HTML tag.
    if (isNextImageAlias(imageAliases, tagName)) {
        return 'img';
    }
    
    return tagName;
};

/* 🚀 Main transformation function
────────────────────────────────────────────────────────────── */
function transformSource(src, filename) {
    if (/node_modules/.test(filename)) {
        return { code: src };
    }

    try {
        const ast = parse(src, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
        });
        
        const ms = new MagicString(src);
        const rel = path.relative(process.cwd(), filename);
        let mutated = false;
        
        // Add parent references to AST nodes for upward traversal (non-enumerable to avoid infinite recursion)
        walk(ast, {
            enter(node, parent) {
                if (parent && !Object.prototype.hasOwnProperty.call(node, 'parent')) {
                    Object.defineProperty(node, 'parent', { value: parent, enumerable: false });
                }
            }
        });
        
        // 0️⃣ Collect variable declarations first
        const variables = findVariableDeclarations(ast);
        
        // 1️⃣ Gather local identifiers that reference `next/image`.
        const imageAliases = new Set();
        walk(ast, {
            enter(node) {
                if (node.type === 'ImportDeclaration' &&
                    node.source.value === 'next/image') {
                    for (const spec of node.specifiers) {
                        imageAliases.add(spec.local.name);
                    }
                }
            },
        });
        
        // 2️⃣ Inject attributes with enhanced semantic context.
        walk(ast, {
            enter(node) {
                if (node.type !== 'JSXOpeningElement') return;
                
                const mapContext = findMapContext(node, variables);
                const semanticName = getSemanticName(node, mapContext, imageAliases);
                
                if (!semanticName ||
                    ['Fragment', 'React.Fragment'].includes(semanticName) ||
                    (!isNextImageAlias(imageAliases, semanticName.split('-')[0]) &&
                        !shouldTag(semanticName))) return;
                
                const { line, column } = node.loc.start;
                let orchidsId = `${rel}:${line}:${column}`;
                
                // Enhance the ID with context if we have map information
                if (mapContext) {
                    orchidsId += `@${mapContext.arrayName}`;
                }
                
                // 🔍 Append referenced variable locations for simple identifier references in props
                node.attributes?.forEach((attr) => {
                    if (attr.type === 'JSXAttribute' &&
                        attr.value?.type === 'JSXExpressionContainer' &&
                        attr.value.expression?.type === 'Identifier') {
                        const refName = attr.value.expression.name;
                        const varInfo = variables.get(refName);
                        
                        if (varInfo) {
                            orchidsId += `@${refName}`;
                        }
                    }
                });
                
                // 📍 If inside a map context and we have an index variable, inject data-map-index
                if (mapContext?.indexVarName) {
                    ms.appendLeft(node.name.end, ` data-map-index={${mapContext.indexVarName}}`);
                }
                
                ms.appendLeft(node.name.end, ` data-orchids-id="${orchidsId}" data-orchids-name="${semanticName}"`);
                mutated = true;
            },
        });
        
        if (mutated) {
            return {
                code: ms.toString(),
                map: ms.generateMap({ hires: true })
            };
        }
        
        return { code: src };
    } catch (err) {
        console.error('[componentTagger] Parse error:', err);
        return { code: src };
    }
}

export function componentTaggerPlugin() {
    return {
        name: 'component-tagger',
        enforce: 'pre',
        transform(src, id) {
            if (id.endsWith('.jsx') || id.endsWith('.tsx')) {
                return transformSource(src, id);
            }
        }
    };
}
