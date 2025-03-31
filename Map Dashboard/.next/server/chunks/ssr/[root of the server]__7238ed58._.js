module.exports = {

"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[project]/src/utils/csvParser.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "parseCSV": (()=>parseCSV)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$papaparse$2f$papaparse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/papaparse/papaparse.js [app-ssr] (ecmascript)");
;
function parseCSV(file) {
    return new Promise((resolve, reject)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$papaparse$2f$papaparse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results)=>{
                const schools = [];
                // Process each row from the CSV
                results.data.forEach((row)=>{
                    // Map CSV columns to our School type
                    const school = {
                        name: row['School Name'] || '',
                        district: row['School District'] || '',
                        address: row['Address'] || '',
                        city: row['City'] || '',
                        state: row['State'] || '',
                        zipCode: row['Zip Code'] || ''
                    };
                    // Only add valid schools with required data
                    if (school.name && school.address && school.city && school.state) {
                        schools.push(school);
                    }
                });
                resolve(schools);
            },
            error: (error)=>{
                reject(error);
            }
        });
    });
}
}}),
"[project]/src/components/CSVUpload.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CSVUpload)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$csvParser$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/csvParser.ts [app-ssr] (ecmascript)");
;
;
;
function CSVUpload({ onDataLoaded, setLoading }) {
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fileName, setFileName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleDragOver = (e)=>{
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = ()=>{
        setIsDragging(false);
    };
    const handleDrop = async (e)=>{
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await processFile(files[0]);
        }
    };
    const handleFileChange = async (e)=>{
        const files = e.target.files;
        if (files && files.length > 0) {
            await processFile(files[0]);
        }
    };
    const processFile = async (file)=>{
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            alert('Please upload a CSV file');
            return;
        }
        setFileName(file.name);
        setLoading(true);
        try {
            const schools = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$csvParser$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseCSV"])(file);
            onDataLoaded(schools);
        } catch (error) {
            console.error('Error parsing CSV:', error);
            alert('Error parsing CSV file');
        } finally{
            setLoading(false);
        }
    };
    const handleSampleDownload = ()=>{
        window.open('/sample-schools.csv', '_blank');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "font-semibold text-lg mb-2 text-black",
                children: "Import School Data"
            }, void 0, false, {
                fileName: "[project]/src/components/CSVUpload.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition-colors ${isDragging ? 'border-gray-700 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`,
                onDragOver: handleDragOver,
                onDragLeave: handleDragLeave,
                onDrop: handleDrop,
                onClick: ()=>document.getElementById('file-upload')?.click(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "file-upload",
                        type: "file",
                        accept: ".csv",
                        className: "hidden",
                        onChange: handleFileChange
                    }, void 0, false, {
                        fileName: "[project]/src/components/CSVUpload.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-10 w-10 mx-auto mb-3 text-gray-400",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 1.5,
                            d: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CSVUpload.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/CSVUpload.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    fileName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-black mb-1",
                                children: [
                                    "File loaded: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold",
                                        children: fileName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CSVUpload.tsx",
                                        lineNumber: 102,
                                        columnNumber: 57
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-700",
                                children: "Click or drop another file to replace"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CSVUpload.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg font-medium text-black mb-1",
                                children: "Drag and drop your CSV file here"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 107,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-700 mb-2",
                                children: "or click to select a file"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    handleSampleDownload();
                                },
                                className: "text-sm text-gray-700 hover:text-black hover:underline",
                                children: "Download sample CSV format"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CSVUpload.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CSVUpload.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 text-xs text-gray-700 bg-gray-50 p-3 rounded border border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-1 font-medium text-black",
                        children: "Required CSV Columns:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CSVUpload.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-3 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "• School Name"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "• School District"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "• Address"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "• City"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "• State"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "• Zip Code"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CSVUpload.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CSVUpload.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CSVUpload.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CSVUpload.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/components/SchoolList.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SchoolList)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
function SchoolList({ schools, selectedSchool, setSelectedSchool, isCollapsed: externalIsCollapsed, setIsCollapsed: externalSetIsCollapsed }) {
    // Use internal state if no external state is provided
    const [internalIsCollapsed, setInternalIsCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // Use either external or internal state
    const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
    const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;
    // Filter schools based on search query
    const filteredSchools = searchQuery.trim() === '' ? schools : schools.filter((school)=>{
        const query = searchQuery.toLowerCase();
        return school.name.toLowerCase().includes(query) || school.district.toLowerCase().includes(query) || school.address.toLowerCase().includes(query) || school.city.toLowerCase().includes(query) || school.state.toLowerCase().includes(query) || school.zipCode.toLowerCase().includes(query);
    });
    const schoolCount = filteredSchools.length;
    const geocodingPendingCount = filteredSchools.filter((school)=>!school.latitude || !school.longitude).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full overflow-hidden bg-white rounded-lg shadow border border-gray-200 flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50",
                onClick: ()=>setIsCollapsed(!isCollapsed),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-bold text-lg text-black",
                                children: [
                                    "Schools (",
                                    schools.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SchoolList.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            geocodingPendingCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 mt-1",
                                children: [
                                    geocodingPendingCount,
                                    " school",
                                    geocodingPendingCount !== 1 ? 's' : '',
                                    " awaiting geocoding"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SchoolList.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SchoolList.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "text-gray-700 hover:text-black transition-colors flex items-center gap-1",
                        "aria-label": isCollapsed ? "Expand school list" : "Collapse school list",
                        children: isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs hidden sm:inline",
                                    children: "Expand"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    viewBox: "0 0 24 24",
                                    fill: "currentColor",
                                    className: "w-5 h-5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SchoolList.tsx",
                                        lineNumber: 69,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 68,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs hidden sm:inline",
                                    children: "Collapse"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    viewBox: "0 0 24 24",
                                    fill: "currentColor",
                                    className: "w-5 h-5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SchoolList.tsx",
                                        lineNumber: 76,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/SchoolList.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SchoolList.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    schools.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 pt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search schools...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        className: "w-full p-2 pl-8 border border-gray-300 rounded text-sm focus:ring-gray-500 focus:border-gray-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SchoolList.tsx",
                                        lineNumber: 88,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-4 w-4 absolute left-2.5 top-2.5 text-gray-400",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SchoolList.tsx",
                                            lineNumber: 102,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SchoolList.tsx",
                                        lineNumber: 95,
                                        columnNumber: 17
                                    }, this),
                                    searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSearchQuery(''),
                                        className: "absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-4 w-4",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SchoolList.tsx",
                                                lineNumber: 121,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SchoolList.tsx",
                                            lineNumber: 114,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SchoolList.tsx",
                                        lineNumber: 110,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SchoolList.tsx",
                                lineNumber: 87,
                                columnNumber: 15
                            }, this),
                            searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs text-gray-600",
                                children: [
                                    "Found ",
                                    schoolCount,
                                    " ",
                                    schoolCount === 1 ? 'school' : 'schools',
                                    ' matching "',
                                    searchQuery,
                                    '"'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SchoolList.tsx",
                                lineNumber: 132,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SchoolList.tsx",
                        lineNumber: 86,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-auto flex-grow",
                        children: schools.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 text-center text-gray-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-12 w-12 mx-auto mb-3 text-gray-400",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 1,
                                        d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SchoolList.tsx",
                                        lineNumber: 143,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 142,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium",
                                    children: "No schools imported yet"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 145,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm mt-1",
                                    children: "Upload a CSV file to get started"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 146,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SchoolList.tsx",
                            lineNumber: 141,
                            columnNumber: 15
                        }, this) : filteredSchools.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 text-center text-gray-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "No schools match your search"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 150,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "mt-2 text-sm text-gray-700 hover:text-black underline",
                                    onClick: ()=>setSearchQuery(''),
                                    children: "Clear search"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 151,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SchoolList.tsx",
                            lineNumber: 149,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "divide-y divide-gray-200 px-1 py-2",
                            children: filteredSchools.map((school)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: `p-3 hover:bg-gray-50 cursor-pointer transition-colors rounded mx-1 my-0.5 ${selectedSchool && selectedSchool.name === school.name && selectedSchool.address === school.address ? 'bg-gray-100 border-l-4 border-gray-400' : ''}`,
                                    onClick: ()=>setSelectedSchool(school),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-medium text-black",
                                            children: school.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SchoolList.tsx",
                                            lineNumber: 171,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-700",
                                            children: school.district
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SchoolList.tsx",
                                            lineNumber: 172,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-900 mt-1",
                                            children: school.address
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SchoolList.tsx",
                                            lineNumber: 173,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-900",
                                            children: [
                                                school.city,
                                                ", ",
                                                school.state,
                                                " ",
                                                school.zipCode
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SchoolList.tsx",
                                            lineNumber: 174,
                                            columnNumber: 21
                                        }, this),
                                        !school.latitude && !school.longitude && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded border border-gray-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    className: "h-3 w-3 inline-block mr-1",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SchoolList.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SchoolList.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 25
                                                }, this),
                                                "Geocoding pending"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SchoolList.tsx",
                                            lineNumber: 176,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, school.id || `${school.name}-${school.address}`, true, {
                                    fileName: "[project]/src/components/SchoolList.tsx",
                                    lineNumber: 161,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SchoolList.tsx",
                            lineNumber: 159,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/SchoolList.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SchoolList.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/utils/hubspot.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "fetchSchoolsFromHubSpot": (()=>fetchSchoolsFromHubSpot),
    "importSchoolsToHubSpot": (()=>importSchoolsToHubSpot)
});
// HubSpot API base URL
const HUBSPOT_API_BASE = 'https://api.hubapi.com/crm/v3';
async function fetchSchoolsFromHubSpot(apiKey) {
    try {
        // Fetch companies (schools) from HubSpot
        const response = await fetch(`${HUBSPOT_API_BASE}/objects/companies?limit=100`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HubSpot API error: ${response.status}`);
        }
        const data = await response.json();
        // Map HubSpot companies to School objects
        const schools = data.results.map((company)=>{
            // Extract properties from HubSpot company
            const properties = company.properties;
            return {
                id: company.id,
                name: properties.name || '',
                district: properties.school_district || '',
                address: properties.address || '',
                city: properties.city || '',
                state: properties.state || '',
                zipCode: properties.zip || '',
                // If latitude/longitude are stored in HubSpot
                latitude: properties.latitude ? parseFloat(properties.latitude) : undefined,
                longitude: properties.longitude ? parseFloat(properties.longitude) : undefined
            };
        });
        return schools;
    } catch (error) {
        console.error('Error fetching from HubSpot:', error);
        throw error;
    }
}
async function importSchoolsToHubSpot(apiKey, schools) {
    try {
        // Batch create companies in HubSpot
        // Note: HubSpot batch API allows up to 100 objects per request
        const BATCH_SIZE = 100;
        for(let i = 0; i < schools.length; i += BATCH_SIZE){
            const batch = schools.slice(i, i + BATCH_SIZE);
            // Format schools for HubSpot API
            const hubspotCompanies = batch.map((school)=>({
                    properties: {
                        name: school.name,
                        school_district: school.district,
                        address: school.address,
                        city: school.city,
                        state: school.state,
                        zip: school.zipCode,
                        latitude: school.latitude?.toString(),
                        longitude: school.longitude?.toString(),
                        company_type: 'SCHOOL',
                        industry: 'EDUCATION'
                    }
                }));
            // Send batch to HubSpot
            const response = await fetch(`${HUBSPOT_API_BASE}/objects/companies/batch/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: hubspotCompanies
                })
            });
            if (!response.ok) {
                throw new Error(`HubSpot API error: ${response.status}`);
            }
        }
        return true;
    } catch (error) {
        console.error('Error importing to HubSpot:', error);
        return false;
    }
}
}}),
"[project]/src/components/HubSpotIntegration.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>HubSpotIntegration)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$hubspot$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/hubspot.ts [app-ssr] (ecmascript)");
;
;
;
function HubSpotIntegration({ schools, onSchoolsLoaded, setLoading }) {
    const [apiKey, setApiKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showApiInput, setShowApiInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch schools from HubSpot
    const handleFetchFromHubSpot = async ()=>{
        if (!apiKey) {
            setMessage({
                text: 'Please enter your HubSpot API key',
                type: 'error'
            });
            return;
        }
        try {
            setLoading(true);
            setMessage({
                text: 'Fetching schools from HubSpot...',
                type: 'info'
            });
            const hubspotSchools = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$hubspot$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSchoolsFromHubSpot"])(apiKey);
            if (hubspotSchools.length === 0) {
                setMessage({
                    text: 'No schools found in HubSpot',
                    type: 'info'
                });
            } else {
                onSchoolsLoaded(hubspotSchools);
                setMessage({
                    text: `Successfully imported ${hubspotSchools.length} schools from HubSpot`,
                    type: 'success'
                });
                // Hide API key input after successful fetch
                setShowApiInput(false);
            }
        } catch (error) {
            setMessage({
                text: `Error fetching from HubSpot: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error'
            });
        } finally{
            setLoading(false);
        }
    };
    // Import current schools to HubSpot
    const handleExportToHubSpot = async ()=>{
        if (!apiKey) {
            setMessage({
                text: 'Please enter your HubSpot API key',
                type: 'error'
            });
            return;
        }
        if (schools.length === 0) {
            setMessage({
                text: 'No schools to export',
                type: 'error'
            });
            return;
        }
        try {
            setLoading(true);
            setMessage({
                text: 'Exporting schools to HubSpot...',
                type: 'info'
            });
            const success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$hubspot$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["importSchoolsToHubSpot"])(apiKey, schools);
            if (success) {
                setMessage({
                    text: `Successfully exported ${schools.length} schools to HubSpot`,
                    type: 'success'
                });
                // Hide API key input after successful export
                setShowApiInput(false);
            } else {
                setMessage({
                    text: 'Failed to export schools to HubSpot',
                    type: 'error'
                });
            }
        } catch (error) {
            setMessage({
                text: `Error exporting to HubSpot: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error'
            });
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row justify-between md:items-center mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-black",
                        children: "HubSpot Integration"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HubSpotIntegration.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "text-gray-700 text-sm hover:text-black hover:underline transition-colors flex items-center mt-1 md:mt-0",
                        onClick: ()=>setShowApiInput(!showApiInput),
                        children: showApiInput ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-4 w-4 mr-1",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M6 18L18 6M6 6l12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                    lineNumber: 102,
                                    columnNumber: 15
                                }, this),
                                "Hide API Key"
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-4 w-4 mr-1",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                            lineNumber: 110,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this),
                                "Configure HubSpot"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/HubSpotIntegration.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            showApiInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 p-4 border rounded-lg bg-white border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "apiKey",
                            className: "block text-sm font-medium text-black mb-1",
                            children: "HubSpot API Key"
                        }, void 0, false, {
                            fileName: "[project]/src/components/HubSpotIntegration.tsx",
                            lineNumber: 122,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "password",
                            id: "apiKey",
                            value: apiKey,
                            onChange: (e)=>setApiKey(e.target.value),
                            className: "w-full p-2 border border-gray-300 rounded focus:ring-gray-500 focus:border-gray-500 bg-white text-black",
                            placeholder: "Enter your HubSpot API key"
                        }, void 0, false, {
                            fileName: "[project]/src/components/HubSpotIntegration.tsx",
                            lineNumber: 125,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-xs text-gray-700",
                            children: "Your API key is never stored on our servers and is only used for direct API calls."
                        }, void 0, false, {
                            fileName: "[project]/src/components/HubSpotIntegration.tsx",
                            lineNumber: 133,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/HubSpotIntegration.tsx",
                    lineNumber: 121,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `p-3 rounded mb-4 flex items-start ${message.type === 'success' ? 'bg-gray-100 text-black border border-gray-300' : message.type === 'error' ? 'bg-gray-100 text-black border border-gray-300' : 'bg-gray-100 text-black border border-gray-300'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mr-2 mt-0.5",
                        children: message.type === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-4 w-4 text-green-700",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M5 13l4 4L19 7"
                            }, void 0, false, {
                                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                lineNumber: 153,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/HubSpotIntegration.tsx",
                            lineNumber: 152,
                            columnNumber: 15
                        }, this) : message.type === 'error' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-4 w-4 text-red-700",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M6 18L18 6M6 6l12 12"
                            }, void 0, false, {
                                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                lineNumber: 157,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/HubSpotIntegration.tsx",
                            lineNumber: 156,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-4 w-4 text-blue-700",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                lineNumber: 161,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/HubSpotIntegration.tsx",
                            lineNumber: 160,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/HubSpotIntegration.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex-1",
                        children: message.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/HubSpotIntegration.tsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMessage(null),
                        className: "ml-2 text-gray-500 hover:text-gray-700",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-4 w-4",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M6 18L18 6M6 6l12 12"
                            }, void 0, false, {
                                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                lineNumber: 171,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/HubSpotIntegration.tsx",
                            lineNumber: 170,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/HubSpotIntegration.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleFetchFromHubSpot,
                        className: "px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center",
                        disabled: !apiKey,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                className: "h-4 w-4 mr-1",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            "Import from HubSpot"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/HubSpotIntegration.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleExportToHubSpot,
                        className: "px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center",
                        disabled: !apiKey || schools.length === 0,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                className: "h-4 w-4 mr-1",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                    lineNumber: 195,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this),
                            "Export to HubSpot"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/HubSpotIntegration.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/HubSpotIntegration.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/HubSpotIntegration.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/utils/geocoding.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "geocodeAddress": (()=>geocodeAddress),
    "geocodeSchools": (()=>geocodeSchools)
});
async function geocodeAddress(address) {
    try {
        const query = encodeURIComponent(`${address}`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
            headers: {
                'User-Agent': 'SchoolMapDashboard/1.0'
            }
        });
        if (!response.ok) {
            throw new Error(`Geocoding failed with status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            return [
                parseFloat(lat),
                parseFloat(lon)
            ];
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}
async function geocodeSchools(schools) {
    const geocodedSchools = [];
    for (const school of schools){
        // Create a complete address string
        const fullAddress = `${school.address}, ${school.city}, ${school.state} ${school.zipCode}`;
        // Add a delay to avoid rate limiting with the geocoding API
        await new Promise((resolve)=>setTimeout(resolve, 1000));
        const coordinates = await geocodeAddress(fullAddress);
        if (coordinates) {
            geocodedSchools.push({
                ...school,
                latitude: coordinates[0],
                longitude: coordinates[1]
            });
        } else {
            // Keep the school even if geocoding failed
            geocodedSchools.push(school);
        }
    }
    return geocodedSchools;
}
}}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CSVUpload$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CSVUpload.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SchoolList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SchoolList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$HubSpotIntegration$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/HubSpotIntegration.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$geocoding$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/geocoding.ts [app-ssr] (ecmascript)");
;
'use client';
;
;
;
;
;
;
;
// Import Map component dynamically to avoid SSR issues with Leaflet
const Map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[project]/src/components/Map.tsx [app-ssr] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/Map.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full w-full flex items-center justify-center bg-gray-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-black",
                children: "Loading map..."
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 15,
            columnNumber: 5
        }, this)
});
function Home() {
    const [schools, setSchools] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [geocoding, setGeocoding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedSchool, setSelectedSchool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isListCollapsed, setIsListCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewport, setViewport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        center: [
            39.8283,
            -98.5795
        ],
        zoom: 4
    });
    // Handle CSV data after import
    const handleDataLoaded = async (importedSchools)=>{
        setSchools(importedSchools);
        setGeocoding(true);
        // Geocode the imported schools
        const geocodedSchools = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$geocoding$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["geocodeSchools"])(importedSchools);
        setSchools(geocodedSchools);
        setGeocoding(false);
        // Update viewport if we have schools with coordinates
        const schoolsWithCoords = geocodedSchools.filter((school)=>school.latitude && school.longitude);
        if (schoolsWithCoords.length > 0) {
            // Center on the first school with coordinates
            setViewport({
                center: [
                    schoolsWithCoords[0].latitude,
                    schoolsWithCoords[0].longitude
                ],
                zoom: 10
            });
        }
    };
    // Update viewport when a school is selected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedSchool?.latitude && selectedSchool?.longitude) {
            setViewport({
                center: [
                    selectedSchool.latitude,
                    selectedSchool.longitude
                ],
                zoom: 14
            });
        }
    }, [
        selectedSchool
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex min-h-screen flex-col px-4 py-6 md:px-8 md:py-10 bg-white text-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold mb-6 text-black",
                children: "School Photography Client Map"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 rounded-lg shadow border border-gray-200 md:w-1/2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CSVUpload$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            onDataLoaded: handleDataLoaded,
                            setLoading: setLoading
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 rounded-lg shadow border border-gray-200 md:w-1/2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$HubSpotIntegration$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            schools: schools,
                            onSchoolsLoaded: handleDataLoaded,
                            setLoading: setLoading
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            (loading || geocoding) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-6 rounded-lg shadow-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium text-black",
                            children: geocoding ? 'Geocoding addresses...' : 'Processing data...'
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-700 mt-1",
                            children: "This may take a moment"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 86,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-[70vh]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `transition-all duration-300 h-full overflow-hidden ${isListCollapsed ? 'md:col-span-1' : 'md:col-span-4'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SchoolList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            schools: schools,
                            selectedSchool: selectedSchool,
                            setSelectedSchool: setSelectedSchool,
                            isCollapsed: isListCollapsed,
                            setIsCollapsed: setIsListCollapsed
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `transition-all duration-300 h-full rounded-lg overflow-hidden shadow-lg border border-gray-200 ${isListCollapsed ? 'md:col-span-11' : 'md:col-span-8'}`,
                        style: {
                            minHeight: '600px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Map, {
                            schools: schools,
                            viewport: viewport
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)");
        } else {
            "TURBOPACK unreachable";
        }
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}}),
"[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
exports._ = _interop_require_default;
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxRuntime; //# sourceMappingURL=react-jsx-runtime.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
// This has to be a shared module which is shared between client component error boundary and dynamic component
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BailoutToCSRError: null,
    isBailoutToCSRError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    BailoutToCSRError: function() {
        return BailoutToCSRError;
    },
    isBailoutToCSRError: function() {
        return isBailoutToCSRError;
    }
});
const BAILOUT_TO_CSR = 'BAILOUT_TO_CLIENT_SIDE_RENDERING';
class BailoutToCSRError extends Error {
    constructor(reason){
        super("Bail out to client-side rendering: " + reason), this.reason = reason, this.digest = BAILOUT_TO_CSR;
    }
}
function isBailoutToCSRError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === BAILOUT_TO_CSR;
} //# sourceMappingURL=bailout-to-csr.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BailoutToCSR", {
    enumerable: true,
    get: function() {
        return BailoutToCSR;
    }
});
const _bailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)");
function BailoutToCSR(param) {
    let { reason, children } = param;
    if (typeof window === 'undefined') {
        throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(reason), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    return children;
} //# sourceMappingURL=dynamic-bailout-to-csr.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactDOM; //# sourceMappingURL=react-dom.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "encodeURIPath", {
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
});
function encodeURIPath(file) {
    return file.split('/').map((p)=>encodeURIComponent(p)).join('/');
} //# sourceMappingURL=encode-uri-path.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreloadChunks", {
    enumerable: true,
    get: function() {
        return PreloadChunks;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
const _reactdom = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _encodeuripath = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-ssr] (ecmascript)");
function PreloadChunks(param) {
    let { moduleIds } = param;
    // Early return in client compilation and only load requestStore on server side
    if (typeof window !== 'undefined') {
        return null;
    }
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (workStore === undefined) {
        return null;
    }
    const allFiles = [];
    // Search the current dynamic call unique key id in react loadable manifest,
    // and find the corresponding CSS files to preload
    if (workStore.reactLoadableManifest && moduleIds) {
        const manifest = workStore.reactLoadableManifest;
        for (const key of moduleIds){
            if (!manifest[key]) continue;
            const chunks = manifest[key].files;
            allFiles.push(...chunks);
        }
    }
    if (allFiles.length === 0) {
        return null;
    }
    const dplId = ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : '';
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: allFiles.map((chunk)=>{
            const href = workStore.assetPrefix + "/_next/" + (0, _encodeuripath.encodeURIPath)(chunk) + dplId;
            const isCss = chunk.endsWith('.css');
            // If it's stylesheet we use `precedence` o help hoist with React Float.
            // For stylesheets we actually need to render the CSS because nothing else is going to do it so it needs to be part of the component tree.
            // The `preload` for stylesheet is not optional.
            if (isCss) {
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    // @ts-ignore
                    precedence: "dynamic",
                    href: href,
                    rel: "stylesheet",
                    as: "style"
                }, chunk);
            } else {
                // If it's script we use ReactDOM.preload to preload the resources
                (0, _reactdom.preload)(href, {
                    as: 'script',
                    fetchPriority: 'low'
                });
                return null;
            }
        })
    });
} //# sourceMappingURL=preload-chunks.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
const _dynamicbailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-ssr] (ecmascript)");
const _preloadchunks = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-ssr] (ecmascript)");
// Normalize loader to return the module as form { default: Component } for `React.lazy`.
// Also for backward compatible since next/dynamic allows to resolve a component directly with loader
// Client component reference proxy need to be converted to a module.
function convertModule(mod) {
    // Check "default" prop before accessing it, as it could be client reference proxy that could break it reference.
    // Cases:
    // mod: { default: Component }
    // mod: Component
    // mod: { default: proxy(Component) }
    // mod: proxy(Component)
    const hasDefault = mod && 'default' in mod;
    return {
        default: hasDefault ? mod.default : mod
    };
}
const defaultOptions = {
    loader: ()=>Promise.resolve(convertModule(()=>null)),
    loading: null,
    ssr: true
};
function Loadable(options) {
    const opts = {
        ...defaultOptions,
        ...options
    };
    const Lazy = /*#__PURE__*/ (0, _react.lazy)(()=>opts.loader().then(convertModule));
    const Loading = opts.loading;
    function LoadableComponent(props) {
        const fallbackElement = Loading ? /*#__PURE__*/ (0, _jsxruntime.jsx)(Loading, {
            isLoading: true,
            pastDelay: true,
            error: null
        }) : null;
        // If it's non-SSR or provided a loading component, wrap it in a suspense boundary
        const hasSuspenseBoundary = !opts.ssr || !!opts.loading;
        const Wrap = hasSuspenseBoundary ? _react.Suspense : _react.Fragment;
        const wrapProps = hasSuspenseBoundary ? {
            fallback: fallbackElement
        } : {};
        const children = opts.ssr ? /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
            children: [
                typeof window === 'undefined' ? /*#__PURE__*/ (0, _jsxruntime.jsx)(_preloadchunks.PreloadChunks, {
                    moduleIds: opts.modules
                }) : null,
                /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                    ...props
                })
            ]
        }) : /*#__PURE__*/ (0, _jsxruntime.jsx)(_dynamicbailouttocsr.BailoutToCSR, {
            reason: "next/dynamic",
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                ...props
            })
        });
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Wrap, {
            ...wrapProps,
            children: children
        });
    }
    LoadableComponent.displayName = 'LoadableComponent';
    return LoadableComponent;
}
const _default = Loadable; //# sourceMappingURL=loadable.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return dynamic;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)");
const _loadable = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-ssr] (ecmascript)"));
function dynamic(dynamicOptions, options) {
    var _mergedOptions_loadableGenerated;
    const loadableOptions = {};
    if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    }
    const mergedOptions = {
        ...loadableOptions,
        ...options
    };
    return (0, _loadable.default)({
        ...mergedOptions,
        modules: (_mergedOptions_loadableGenerated = mergedOptions.loadableGenerated) == null ? void 0 : _mergedOptions_loadableGenerated.modules
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-dynamic.js.map
}}),
"[project]/node_modules/papaparse/papaparse.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
/* @license
Papa Parse
v5.5.2
https://github.com/mholt/PapaParse
License: MIT
*/ (function(root, factory) {
    /* globals define */ if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        ((r)=>r !== undefined && __turbopack_context__.v(r))(factory());
    } else if ("TURBOPACK compile-time truthy", 1) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        "TURBOPACK unreachable";
    }
// in strict mode we cannot access arguments.callee, so we need a named reference to
// stringify the factory method for the blob worker
// eslint-disable-next-line func-name
})(this, function moduleFactory() {
    'use strict';
    var global = function() {
        // alternative method, similar to `Function('return this')()`
        // but without using `eval` (which is disabled when
        // using Content Security Policy).
        if (typeof self !== 'undefined') {
            return self;
        }
        if (typeof window !== 'undefined') {
            return window;
        }
        if (typeof global !== 'undefined') {
            return global;
        }
        // When running tests none of the above have been defined
        return {};
    }();
    function getWorkerBlob() {
        var URL = global.URL || global.webkitURL || null;
        var code = moduleFactory.toString();
        return Papa.BLOB_URL || (Papa.BLOB_URL = URL.createObjectURL(new Blob([
            "var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ",
            '(',
            code,
            ')();'
        ], {
            type: 'text/javascript'
        })));
    }
    var IS_WORKER = !global.document && !!global.postMessage, IS_PAPA_WORKER = global.IS_PAPA_WORKER || false;
    var workers = {}, workerIdCounter = 0;
    var Papa = {};
    Papa.parse = CsvToJson;
    Papa.unparse = JsonToCsv;
    Papa.RECORD_SEP = String.fromCharCode(30);
    Papa.UNIT_SEP = String.fromCharCode(31);
    Papa.BYTE_ORDER_MARK = '\ufeff';
    Papa.BAD_DELIMITERS = [
        '\r',
        '\n',
        '"',
        Papa.BYTE_ORDER_MARK
    ];
    Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
    Papa.NODE_STREAM_INPUT = 1;
    // Configurable chunk sizes for local and remote files, respectively
    Papa.LocalChunkSize = 1024 * 1024 * 10; // 10 MB
    Papa.RemoteChunkSize = 1024 * 1024 * 5; // 5 MB
    Papa.DefaultDelimiter = ','; // Used if not specified and detection fails
    // Exposed for testing and development only
    Papa.Parser = Parser;
    Papa.ParserHandle = ParserHandle;
    Papa.NetworkStreamer = NetworkStreamer;
    Papa.FileStreamer = FileStreamer;
    Papa.StringStreamer = StringStreamer;
    Papa.ReadableStreamStreamer = ReadableStreamStreamer;
    if (typeof PAPA_BROWSER_CONTEXT === 'undefined') {
        Papa.DuplexStreamStreamer = DuplexStreamStreamer;
    }
    if (global.jQuery) {
        var $ = global.jQuery;
        $.fn.parse = function(options) {
            var config = options.config || {};
            var queue = [];
            this.each(function(idx) {
                var supported = $(this).prop('tagName').toUpperCase() === 'INPUT' && $(this).attr('type').toLowerCase() === 'file' && global.FileReader;
                if (!supported || !this.files || this.files.length === 0) return true; // continue to next input element
                for(var i = 0; i < this.files.length; i++){
                    queue.push({
                        file: this.files[i],
                        inputElem: this,
                        instanceConfig: $.extend({}, config)
                    });
                }
            });
            parseNextFile(); // begin parsing
            return this; // maintains chainability
            "TURBOPACK unreachable";
            function parseNextFile() {
                if (queue.length === 0) {
                    if (isFunction(options.complete)) options.complete();
                    return;
                }
                var f = queue[0];
                if (isFunction(options.before)) {
                    var returned = options.before(f.file, f.inputElem);
                    if (typeof returned === 'object') {
                        if (returned.action === 'abort') {
                            error('AbortError', f.file, f.inputElem, returned.reason);
                            return; // Aborts all queued files immediately
                        } else if (returned.action === 'skip') {
                            fileComplete(); // parse the next file in the queue, if any
                            return;
                        } else if (typeof returned.config === 'object') f.instanceConfig = $.extend(f.instanceConfig, returned.config);
                    } else if (returned === 'skip') {
                        fileComplete(); // parse the next file in the queue, if any
                        return;
                    }
                }
                // Wrap up the user's complete callback, if any, so that ours also gets executed
                var userCompleteFunc = f.instanceConfig.complete;
                f.instanceConfig.complete = function(results) {
                    if (isFunction(userCompleteFunc)) userCompleteFunc(results, f.file, f.inputElem);
                    fileComplete();
                };
                Papa.parse(f.file, f.instanceConfig);
            }
            function error(name, file, elem, reason) {
                if (isFunction(options.error)) options.error({
                    name: name
                }, file, elem, reason);
            }
            function fileComplete() {
                queue.splice(0, 1);
                parseNextFile();
            }
        };
    }
    if (IS_PAPA_WORKER) {
        global.onmessage = workerThreadReceivedMessage;
    }
    function CsvToJson(_input, _config) {
        _config = _config || {};
        var dynamicTyping = _config.dynamicTyping || false;
        if (isFunction(dynamicTyping)) {
            _config.dynamicTypingFunction = dynamicTyping;
            // Will be filled on first row call
            dynamicTyping = {};
        }
        _config.dynamicTyping = dynamicTyping;
        _config.transform = isFunction(_config.transform) ? _config.transform : false;
        if (_config.worker && Papa.WORKERS_SUPPORTED) {
            var w = newWorker();
            w.userStep = _config.step;
            w.userChunk = _config.chunk;
            w.userComplete = _config.complete;
            w.userError = _config.error;
            _config.step = isFunction(_config.step);
            _config.chunk = isFunction(_config.chunk);
            _config.complete = isFunction(_config.complete);
            _config.error = isFunction(_config.error);
            delete _config.worker; // prevent infinite loop
            w.postMessage({
                input: _input,
                config: _config,
                workerId: w.id
            });
            return;
        }
        var streamer = null;
        if (_input === Papa.NODE_STREAM_INPUT && typeof PAPA_BROWSER_CONTEXT === 'undefined') {
            // create a node Duplex stream for use
            // with .pipe
            streamer = new DuplexStreamStreamer(_config);
            return streamer.getStream();
        } else if (typeof _input === 'string') {
            _input = stripBom(_input);
            if (_config.download) streamer = new NetworkStreamer(_config);
            else streamer = new StringStreamer(_config);
        } else if (_input.readable === true && isFunction(_input.read) && isFunction(_input.on)) {
            streamer = new ReadableStreamStreamer(_config);
        } else if (global.File && _input instanceof File || _input instanceof Object) streamer = new FileStreamer(_config);
        return streamer.stream(_input);
        "TURBOPACK unreachable";
        // Strip character from UTF-8 BOM encoded files that cause issue parsing the file
        function stripBom(string) {
            if (string.charCodeAt(0) === 0xfeff) {
                return string.slice(1);
            }
            return string;
        }
    }
    function JsonToCsv(_input, _config) {
        // Default configuration
        /** whether to surround every datum with quotes */ var _quotes = false;
        /** whether to write headers */ var _writeHeader = true;
        /** delimiting character(s) */ var _delimiter = ',';
        /** newline character(s) */ var _newline = '\r\n';
        /** quote character */ var _quoteChar = '"';
        /** escaped quote character, either "" or <config.escapeChar>" */ var _escapedQuote = _quoteChar + _quoteChar;
        /** whether to skip empty lines */ var _skipEmptyLines = false;
        /** the columns (keys) we expect when we unparse objects */ var _columns = null;
        /** whether to prevent outputting cells that can be parsed as formulae by spreadsheet software (Excel and LibreOffice) */ var _escapeFormulae = false;
        unpackConfig();
        var quoteCharRegex = new RegExp(escapeRegExp(_quoteChar), 'g');
        if (typeof _input === 'string') _input = JSON.parse(_input);
        if (Array.isArray(_input)) {
            if (!_input.length || Array.isArray(_input[0])) return serialize(null, _input, _skipEmptyLines);
            else if (typeof _input[0] === 'object') return serialize(_columns || Object.keys(_input[0]), _input, _skipEmptyLines);
        } else if (typeof _input === 'object') {
            if (typeof _input.data === 'string') _input.data = JSON.parse(_input.data);
            if (Array.isArray(_input.data)) {
                if (!_input.fields) _input.fields = _input.meta && _input.meta.fields || _columns;
                if (!_input.fields) _input.fields = Array.isArray(_input.data[0]) ? _input.fields : typeof _input.data[0] === 'object' ? Object.keys(_input.data[0]) : [];
                if (!Array.isArray(_input.data[0]) && typeof _input.data[0] !== 'object') _input.data = [
                    _input.data
                ]; // handles input like [1,2,3] or ['asdf']
            }
            return serialize(_input.fields || [], _input.data || [], _skipEmptyLines);
        }
        // Default (any valid paths should return before this)
        throw new Error('Unable to serialize unrecognized input');
        function unpackConfig() {
            if (typeof _config !== 'object') return;
            if (typeof _config.delimiter === 'string' && !Papa.BAD_DELIMITERS.filter(function(value) {
                return _config.delimiter.indexOf(value) !== -1;
            }).length) {
                _delimiter = _config.delimiter;
            }
            if (typeof _config.quotes === 'boolean' || typeof _config.quotes === 'function' || Array.isArray(_config.quotes)) _quotes = _config.quotes;
            if (typeof _config.skipEmptyLines === 'boolean' || typeof _config.skipEmptyLines === 'string') _skipEmptyLines = _config.skipEmptyLines;
            if (typeof _config.newline === 'string') _newline = _config.newline;
            if (typeof _config.quoteChar === 'string') _quoteChar = _config.quoteChar;
            if (typeof _config.header === 'boolean') _writeHeader = _config.header;
            if (Array.isArray(_config.columns)) {
                if (_config.columns.length === 0) throw new Error('Option columns is empty');
                _columns = _config.columns;
            }
            if (_config.escapeChar !== undefined) {
                _escapedQuote = _config.escapeChar + _quoteChar;
            }
            if (_config.escapeFormulae instanceof RegExp) {
                _escapeFormulae = _config.escapeFormulae;
            } else if (typeof _config.escapeFormulae === 'boolean' && _config.escapeFormulae) {
                _escapeFormulae = /^[=+\-@\t\r].*$/;
            }
        }
        /** The double for loop that iterates the data and writes out a CSV string including header row */ function serialize(fields, data, skipEmptyLines) {
            var csv = '';
            if (typeof fields === 'string') fields = JSON.parse(fields);
            if (typeof data === 'string') data = JSON.parse(data);
            var hasHeader = Array.isArray(fields) && fields.length > 0;
            var dataKeyedByField = !Array.isArray(data[0]);
            // If there a header row, write it first
            if (hasHeader && _writeHeader) {
                for(var i = 0; i < fields.length; i++){
                    if (i > 0) csv += _delimiter;
                    csv += safe(fields[i], i);
                }
                if (data.length > 0) csv += _newline;
            }
            // Then write out the data
            for(var row = 0; row < data.length; row++){
                var maxCol = hasHeader ? fields.length : data[row].length;
                var emptyLine = false;
                var nullLine = hasHeader ? Object.keys(data[row]).length === 0 : data[row].length === 0;
                if (skipEmptyLines && !hasHeader) {
                    emptyLine = skipEmptyLines === 'greedy' ? data[row].join('').trim() === '' : data[row].length === 1 && data[row][0].length === 0;
                }
                if (skipEmptyLines === 'greedy' && hasHeader) {
                    var line = [];
                    for(var c = 0; c < maxCol; c++){
                        var cx = dataKeyedByField ? fields[c] : c;
                        line.push(data[row][cx]);
                    }
                    emptyLine = line.join('').trim() === '';
                }
                if (!emptyLine) {
                    for(var col = 0; col < maxCol; col++){
                        if (col > 0 && !nullLine) csv += _delimiter;
                        var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
                        csv += safe(data[row][colIdx], col);
                    }
                    if (row < data.length - 1 && (!skipEmptyLines || maxCol > 0 && !nullLine)) {
                        csv += _newline;
                    }
                }
            }
            return csv;
        }
        /** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */ function safe(str, col) {
            if (typeof str === 'undefined' || str === null) return '';
            if (str.constructor === Date) return JSON.stringify(str).slice(1, 25);
            var needsQuotes = false;
            if (_escapeFormulae && typeof str === "string" && _escapeFormulae.test(str)) {
                str = "'" + str;
                needsQuotes = true;
            }
            var escapedQuoteStr = str.toString().replace(quoteCharRegex, _escapedQuote);
            needsQuotes = needsQuotes || _quotes === true || typeof _quotes === 'function' && _quotes(str, col) || Array.isArray(_quotes) && _quotes[col] || hasAny(escapedQuoteStr, Papa.BAD_DELIMITERS) || escapedQuoteStr.indexOf(_delimiter) > -1 || escapedQuoteStr.charAt(0) === ' ' || escapedQuoteStr.charAt(escapedQuoteStr.length - 1) === ' ';
            return needsQuotes ? _quoteChar + escapedQuoteStr + _quoteChar : escapedQuoteStr;
        }
        function hasAny(str, substrings) {
            for(var i = 0; i < substrings.length; i++)if (str.indexOf(substrings[i]) > -1) return true;
            return false;
        }
    }
    /** ChunkStreamer is the base prototype for various streamer implementations. */ function ChunkStreamer(config) {
        this._handle = null;
        this._finished = false;
        this._completed = false;
        this._halted = false;
        this._input = null;
        this._baseIndex = 0;
        this._partialLine = '';
        this._rowCount = 0;
        this._start = 0;
        this._nextChunk = null;
        this.isFirstChunk = true;
        this._completeResults = {
            data: [],
            errors: [],
            meta: {}
        };
        replaceConfig.call(this, config);
        this.parseChunk = function(chunk, isFakeChunk) {
            // First chunk pre-processing
            const skipFirstNLines = parseInt(this._config.skipFirstNLines) || 0;
            if (this.isFirstChunk && skipFirstNLines > 0) {
                let _newline = this._config.newline;
                if (!_newline) {
                    const quoteChar = this._config.quoteChar || '"';
                    _newline = this._handle.guessLineEndings(chunk, quoteChar);
                }
                const splitChunk = chunk.split(_newline);
                chunk = [
                    ...splitChunk.slice(skipFirstNLines)
                ].join(_newline);
            }
            if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk)) {
                var modifiedChunk = this._config.beforeFirstChunk(chunk);
                if (modifiedChunk !== undefined) chunk = modifiedChunk;
            }
            this.isFirstChunk = false;
            this._halted = false;
            // Rejoin the line we likely just split in two by chunking the file
            var aggregate = this._partialLine + chunk;
            this._partialLine = '';
            var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);
            if (this._handle.paused() || this._handle.aborted()) {
                this._halted = true;
                return;
            }
            var lastIndex = results.meta.cursor;
            if (!this._finished) {
                this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
                this._baseIndex = lastIndex;
            }
            if (results && results.data) this._rowCount += results.data.length;
            var finishedIncludingPreview = this._finished || this._config.preview && this._rowCount >= this._config.preview;
            if (IS_PAPA_WORKER) {
                global.postMessage({
                    results: results,
                    workerId: Papa.WORKER_ID,
                    finished: finishedIncludingPreview
                });
            } else if (isFunction(this._config.chunk) && !isFakeChunk) {
                this._config.chunk(results, this._handle);
                if (this._handle.paused() || this._handle.aborted()) {
                    this._halted = true;
                    return;
                }
                results = undefined;
                this._completeResults = undefined;
            }
            if (!this._config.step && !this._config.chunk) {
                this._completeResults.data = this._completeResults.data.concat(results.data);
                this._completeResults.errors = this._completeResults.errors.concat(results.errors);
                this._completeResults.meta = results.meta;
            }
            if (!this._completed && finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted)) {
                this._config.complete(this._completeResults, this._input);
                this._completed = true;
            }
            if (!finishedIncludingPreview && (!results || !results.meta.paused)) this._nextChunk();
            return results;
        };
        this._sendError = function(error) {
            if (isFunction(this._config.error)) this._config.error(error);
            else if (IS_PAPA_WORKER && this._config.error) {
                global.postMessage({
                    workerId: Papa.WORKER_ID,
                    error: error,
                    finished: false
                });
            }
        };
        function replaceConfig(config) {
            // Deep-copy the config so we can edit it
            var configCopy = copy(config);
            configCopy.chunkSize = parseInt(configCopy.chunkSize); // parseInt VERY important so we don't concatenate strings!
            if (!config.step && !config.chunk) configCopy.chunkSize = null; // disable Range header if not streaming; bad values break IIS - see issue #196
            this._handle = new ParserHandle(configCopy);
            this._handle.streamer = this;
            this._config = configCopy; // persist the copy to the caller
        }
    }
    function NetworkStreamer(config) {
        config = config || {};
        if (!config.chunkSize) config.chunkSize = Papa.RemoteChunkSize;
        ChunkStreamer.call(this, config);
        var xhr;
        if (IS_WORKER) {
            this._nextChunk = function() {
                this._readChunk();
                this._chunkLoaded();
            };
        } else {
            this._nextChunk = function() {
                this._readChunk();
            };
        }
        this.stream = function(url) {
            this._input = url;
            this._nextChunk(); // Starts streaming
        };
        this._readChunk = function() {
            if (this._finished) {
                this._chunkLoaded();
                return;
            }
            xhr = new XMLHttpRequest();
            if (this._config.withCredentials) {
                xhr.withCredentials = this._config.withCredentials;
            }
            if (!IS_WORKER) {
                xhr.onload = bindFunction(this._chunkLoaded, this);
                xhr.onerror = bindFunction(this._chunkError, this);
            }
            xhr.open(this._config.downloadRequestBody ? 'POST' : 'GET', this._input, !IS_WORKER);
            // Headers can only be set when once the request state is OPENED
            if (this._config.downloadRequestHeaders) {
                var headers = this._config.downloadRequestHeaders;
                for(var headerName in headers){
                    xhr.setRequestHeader(headerName, headers[headerName]);
                }
            }
            if (this._config.chunkSize) {
                var end = this._start + this._config.chunkSize - 1; // minus one because byte range is inclusive
                xhr.setRequestHeader('Range', 'bytes=' + this._start + '-' + end);
            }
            try {
                xhr.send(this._config.downloadRequestBody);
            } catch (err) {
                this._chunkError(err.message);
            }
            if (IS_WORKER && xhr.status === 0) this._chunkError();
        };
        this._chunkLoaded = function() {
            if (xhr.readyState !== 4) return;
            if (xhr.status < 200 || xhr.status >= 400) {
                this._chunkError();
                return;
            }
            // Use chunckSize as it may be a diference on reponse lentgh due to characters with more than 1 byte
            this._start += this._config.chunkSize ? this._config.chunkSize : xhr.responseText.length;
            this._finished = !this._config.chunkSize || this._start >= getFileSize(xhr);
            this.parseChunk(xhr.responseText);
        };
        this._chunkError = function(errorMessage) {
            var errorText = xhr.statusText || errorMessage;
            this._sendError(new Error(errorText));
        };
        function getFileSize(xhr) {
            var contentRange = xhr.getResponseHeader('Content-Range');
            if (contentRange === null) {
                return -1;
            }
            return parseInt(contentRange.substring(contentRange.lastIndexOf('/') + 1));
        }
    }
    NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
    NetworkStreamer.prototype.constructor = NetworkStreamer;
    function FileStreamer(config) {
        config = config || {};
        if (!config.chunkSize) config.chunkSize = Papa.LocalChunkSize;
        ChunkStreamer.call(this, config);
        var reader, slice;
        // FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
        // But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
        var usingAsyncReader = typeof FileReader !== 'undefined'; // Safari doesn't consider it a function - see issue #105
        this.stream = function(file) {
            this._input = file;
            slice = file.slice || file.webkitSlice || file.mozSlice;
            if (usingAsyncReader) {
                reader = new FileReader(); // Preferred method of reading files, even in workers
                reader.onload = bindFunction(this._chunkLoaded, this);
                reader.onerror = bindFunction(this._chunkError, this);
            } else reader = new FileReaderSync(); // Hack for running in a web worker in Firefox
            this._nextChunk(); // Starts streaming
        };
        this._nextChunk = function() {
            if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview)) this._readChunk();
        };
        this._readChunk = function() {
            var input = this._input;
            if (this._config.chunkSize) {
                var end = Math.min(this._start + this._config.chunkSize, this._input.size);
                input = slice.call(input, this._start, end);
            }
            var txt = reader.readAsText(input, this._config.encoding);
            if (!usingAsyncReader) this._chunkLoaded({
                target: {
                    result: txt
                }
            }); // mimic the async signature
        };
        this._chunkLoaded = function(event) {
            // Very important to increment start each time before handling results
            this._start += this._config.chunkSize;
            this._finished = !this._config.chunkSize || this._start >= this._input.size;
            this.parseChunk(event.target.result);
        };
        this._chunkError = function() {
            this._sendError(reader.error);
        };
    }
    FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
    FileStreamer.prototype.constructor = FileStreamer;
    function StringStreamer(config) {
        config = config || {};
        ChunkStreamer.call(this, config);
        var remaining;
        this.stream = function(s) {
            remaining = s;
            return this._nextChunk();
        };
        this._nextChunk = function() {
            if (this._finished) return;
            var size = this._config.chunkSize;
            var chunk;
            if (size) {
                chunk = remaining.substring(0, size);
                remaining = remaining.substring(size);
            } else {
                chunk = remaining;
                remaining = '';
            }
            this._finished = !remaining;
            return this.parseChunk(chunk);
        };
    }
    StringStreamer.prototype = Object.create(StringStreamer.prototype);
    StringStreamer.prototype.constructor = StringStreamer;
    function ReadableStreamStreamer(config) {
        config = config || {};
        ChunkStreamer.call(this, config);
        var queue = [];
        var parseOnData = true;
        var streamHasEnded = false;
        this.pause = function() {
            ChunkStreamer.prototype.pause.apply(this, arguments);
            this._input.pause();
        };
        this.resume = function() {
            ChunkStreamer.prototype.resume.apply(this, arguments);
            this._input.resume();
        };
        this.stream = function(stream) {
            this._input = stream;
            this._input.on('data', this._streamData);
            this._input.on('end', this._streamEnd);
            this._input.on('error', this._streamError);
        };
        this._checkIsFinished = function() {
            if (streamHasEnded && queue.length === 1) {
                this._finished = true;
            }
        };
        this._nextChunk = function() {
            this._checkIsFinished();
            if (queue.length) {
                this.parseChunk(queue.shift());
            } else {
                parseOnData = true;
            }
        };
        this._streamData = bindFunction(function(chunk) {
            try {
                queue.push(typeof chunk === 'string' ? chunk : chunk.toString(this._config.encoding));
                if (parseOnData) {
                    parseOnData = false;
                    this._checkIsFinished();
                    this.parseChunk(queue.shift());
                }
            } catch (error) {
                this._streamError(error);
            }
        }, this);
        this._streamError = bindFunction(function(error) {
            this._streamCleanUp();
            this._sendError(error);
        }, this);
        this._streamEnd = bindFunction(function() {
            this._streamCleanUp();
            streamHasEnded = true;
            this._streamData('');
        }, this);
        this._streamCleanUp = bindFunction(function() {
            this._input.removeListener('data', this._streamData);
            this._input.removeListener('end', this._streamEnd);
            this._input.removeListener('error', this._streamError);
        }, this);
    }
    ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
    ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;
    function DuplexStreamStreamer(_config) {
        var Duplex = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Duplex;
        var config = copy(_config);
        var parseOnWrite = true;
        var writeStreamHasFinished = false;
        var parseCallbackQueue = [];
        var stream = null;
        this._onCsvData = function(results) {
            var data = results.data;
            if (!stream.push(data) && !this._handle.paused()) {
                // the writeable consumer buffer has filled up
                // so we need to pause until more items
                // can be processed
                this._handle.pause();
            }
        };
        this._onCsvComplete = function() {
            // node will finish the read stream when
            // null is pushed
            stream.push(null);
        };
        config.step = bindFunction(this._onCsvData, this);
        config.complete = bindFunction(this._onCsvComplete, this);
        ChunkStreamer.call(this, config);
        this._nextChunk = function() {
            if (writeStreamHasFinished && parseCallbackQueue.length === 1) {
                this._finished = true;
            }
            if (parseCallbackQueue.length) {
                parseCallbackQueue.shift()();
            } else {
                parseOnWrite = true;
            }
        };
        this._addToParseQueue = function(chunk, callback) {
            // add to queue so that we can indicate
            // completion via callback
            // node will automatically pause the incoming stream
            // when too many items have been added without their
            // callback being invoked
            parseCallbackQueue.push(bindFunction(function() {
                this.parseChunk(typeof chunk === 'string' ? chunk : chunk.toString(config.encoding));
                if (isFunction(callback)) {
                    return callback();
                }
            }, this));
            if (parseOnWrite) {
                parseOnWrite = false;
                this._nextChunk();
            }
        };
        this._onRead = function() {
            if (this._handle.paused()) {
                // the writeable consumer can handle more data
                // so resume the chunk parsing
                this._handle.resume();
            }
        };
        this._onWrite = function(chunk, encoding, callback) {
            this._addToParseQueue(chunk, callback);
        };
        this._onWriteComplete = function() {
            writeStreamHasFinished = true;
            // have to write empty string
            // so parser knows its done
            this._addToParseQueue('');
        };
        this.getStream = function() {
            return stream;
        };
        stream = new Duplex({
            readableObjectMode: true,
            decodeStrings: false,
            read: bindFunction(this._onRead, this),
            write: bindFunction(this._onWrite, this)
        });
        stream.once('finish', bindFunction(this._onWriteComplete, this));
    }
    if (typeof PAPA_BROWSER_CONTEXT === 'undefined') {
        DuplexStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
        DuplexStreamStreamer.prototype.constructor = DuplexStreamStreamer;
    }
    // Use one ParserHandle per entire CSV file or string
    function ParserHandle(_config) {
        // One goal is to minimize the use of regular expressions...
        var MAX_FLOAT = Math.pow(2, 53);
        var MIN_FLOAT = -MAX_FLOAT;
        var FLOAT = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/;
        var ISO_DATE = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/;
        var self1 = this;
        var _stepCounter = 0; // Number of times step was called (number of rows parsed)
        var _rowCounter = 0; // Number of rows that have been parsed so far
        var _input; // The input being parsed
        var _parser; // The core parser being used
        var _paused = false; // Whether we are paused or not
        var _aborted = false; // Whether the parser has aborted or not
        var _delimiterError; // Temporary state between delimiter detection and processing results
        var _fields = []; // Fields are from the header row of the input, if there is one
        var _results = {
            data: [],
            errors: [],
            meta: {}
        };
        if (isFunction(_config.step)) {
            var userStep = _config.step;
            _config.step = function(results) {
                _results = results;
                if (needsHeaderRow()) processResults();
                else {
                    processResults();
                    // It's possbile that this line was empty and there's no row here after all
                    if (_results.data.length === 0) return;
                    _stepCounter += results.data.length;
                    if (_config.preview && _stepCounter > _config.preview) _parser.abort();
                    else {
                        _results.data = _results.data[0];
                        userStep(_results, self1);
                    }
                }
            };
        }
        /**
		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
		 * when an input comes in multiple chunks, like from a file.
		 */ this.parse = function(input, baseIndex, ignoreLastRow) {
            var quoteChar = _config.quoteChar || '"';
            if (!_config.newline) _config.newline = this.guessLineEndings(input, quoteChar);
            _delimiterError = false;
            if (!_config.delimiter) {
                var delimGuess = guessDelimiter(input, _config.newline, _config.skipEmptyLines, _config.comments, _config.delimitersToGuess);
                if (delimGuess.successful) _config.delimiter = delimGuess.bestDelimiter;
                else {
                    _delimiterError = true; // add error after parsing (otherwise it would be overwritten)
                    _config.delimiter = Papa.DefaultDelimiter;
                }
                _results.meta.delimiter = _config.delimiter;
            } else if (isFunction(_config.delimiter)) {
                _config.delimiter = _config.delimiter(input);
                _results.meta.delimiter = _config.delimiter;
            }
            var parserConfig = copy(_config);
            if (_config.preview && _config.header) parserConfig.preview++; // to compensate for header row
            _input = input;
            _parser = new Parser(parserConfig);
            _results = _parser.parse(_input, baseIndex, ignoreLastRow);
            processResults();
            return _paused ? {
                meta: {
                    paused: true
                }
            } : _results || {
                meta: {
                    paused: false
                }
            };
        };
        this.paused = function() {
            return _paused;
        };
        this.pause = function() {
            _paused = true;
            _parser.abort();
            // If it is streaming via "chunking", the reader will start appending correctly already so no need to substring,
            // otherwise we can get duplicate content within a row
            _input = isFunction(_config.chunk) ? "" : _input.substring(_parser.getCharIndex());
        };
        this.resume = function() {
            if (self1.streamer._halted) {
                _paused = false;
                self1.streamer.parseChunk(_input, true);
            } else {
                // Bugfix: #636 In case the processing hasn't halted yet
                // wait for it to halt in order to resume
                setTimeout(self1.resume, 3);
            }
        };
        this.aborted = function() {
            return _aborted;
        };
        this.abort = function() {
            _aborted = true;
            _parser.abort();
            _results.meta.aborted = true;
            if (isFunction(_config.complete)) _config.complete(_results);
            _input = '';
        };
        this.guessLineEndings = function(input, quoteChar) {
            input = input.substring(0, 1024 * 1024); // max length 1 MB
            // Replace all the text inside quotes
            var re = new RegExp(escapeRegExp(quoteChar) + '([^]*?)' + escapeRegExp(quoteChar), 'gm');
            input = input.replace(re, '');
            var r = input.split('\r');
            var n = input.split('\n');
            var nAppearsFirst = n.length > 1 && n[0].length < r[0].length;
            if (r.length === 1 || nAppearsFirst) return '\n';
            var numWithN = 0;
            for(var i = 0; i < r.length; i++){
                if (r[i][0] === '\n') numWithN++;
            }
            return numWithN >= r.length / 2 ? '\r\n' : '\r';
        };
        function testEmptyLine(s) {
            return _config.skipEmptyLines === 'greedy' ? s.join('').trim() === '' : s.length === 1 && s[0].length === 0;
        }
        function testFloat(s) {
            if (FLOAT.test(s)) {
                var floatValue = parseFloat(s);
                if (floatValue > MIN_FLOAT && floatValue < MAX_FLOAT) {
                    return true;
                }
            }
            return false;
        }
        function processResults() {
            if (_results && _delimiterError) {
                addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \'' + Papa.DefaultDelimiter + '\'');
                _delimiterError = false;
            }
            if (_config.skipEmptyLines) {
                _results.data = _results.data.filter(function(d) {
                    return !testEmptyLine(d);
                });
            }
            if (needsHeaderRow()) fillHeaderFields();
            return applyHeaderAndDynamicTypingAndTransformation();
        }
        function needsHeaderRow() {
            return _config.header && _fields.length === 0;
        }
        function fillHeaderFields() {
            if (!_results) return;
            function addHeader(header, i) {
                if (isFunction(_config.transformHeader)) header = _config.transformHeader(header, i);
                _fields.push(header);
            }
            if (Array.isArray(_results.data[0])) {
                for(var i = 0; needsHeaderRow() && i < _results.data.length; i++)_results.data[i].forEach(addHeader);
                _results.data.splice(0, 1);
            } else _results.data.forEach(addHeader);
        }
        function shouldApplyDynamicTyping(field) {
            // Cache function values to avoid calling it for each row
            if (_config.dynamicTypingFunction && _config.dynamicTyping[field] === undefined) {
                _config.dynamicTyping[field] = _config.dynamicTypingFunction(field);
            }
            return (_config.dynamicTyping[field] || _config.dynamicTyping) === true;
        }
        function parseDynamic(field, value) {
            if (shouldApplyDynamicTyping(field)) {
                if (value === 'true' || value === 'TRUE') return true;
                else if (value === 'false' || value === 'FALSE') return false;
                else if (testFloat(value)) return parseFloat(value);
                else if (ISO_DATE.test(value)) return new Date(value);
                else return value === '' ? null : value;
            }
            return value;
        }
        function applyHeaderAndDynamicTypingAndTransformation() {
            if (!_results || !_config.header && !_config.dynamicTyping && !_config.transform) return _results;
            function processRow(rowSource, i) {
                var row = _config.header ? {} : [];
                var j;
                for(j = 0; j < rowSource.length; j++){
                    var field = j;
                    var value = rowSource[j];
                    if (_config.header) field = j >= _fields.length ? '__parsed_extra' : _fields[j];
                    if (_config.transform) value = _config.transform(value, field);
                    value = parseDynamic(field, value);
                    if (field === '__parsed_extra') {
                        row[field] = row[field] || [];
                        row[field].push(value);
                    } else row[field] = value;
                }
                if (_config.header) {
                    if (j > _fields.length) addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, _rowCounter + i);
                    else if (j < _fields.length) addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, _rowCounter + i);
                }
                return row;
            }
            var incrementBy = 1;
            if (!_results.data.length || Array.isArray(_results.data[0])) {
                _results.data = _results.data.map(processRow);
                incrementBy = _results.data.length;
            } else _results.data = processRow(_results.data, 0);
            if (_config.header && _results.meta) _results.meta.fields = _fields;
            _rowCounter += incrementBy;
            return _results;
        }
        function guessDelimiter(input, newline, skipEmptyLines, comments, delimitersToGuess) {
            var bestDelim, bestDelta, fieldCountPrevRow, maxFieldCount;
            delimitersToGuess = delimitersToGuess || [
                ',',
                '\t',
                '|',
                ';',
                Papa.RECORD_SEP,
                Papa.UNIT_SEP
            ];
            for(var i = 0; i < delimitersToGuess.length; i++){
                var delim = delimitersToGuess[i];
                var delta = 0, avgFieldCount = 0, emptyLinesCount = 0;
                fieldCountPrevRow = undefined;
                var preview = new Parser({
                    comments: comments,
                    delimiter: delim,
                    newline: newline,
                    preview: 10
                }).parse(input);
                for(var j = 0; j < preview.data.length; j++){
                    if (skipEmptyLines && testEmptyLine(preview.data[j])) {
                        emptyLinesCount++;
                        continue;
                    }
                    var fieldCount = preview.data[j].length;
                    avgFieldCount += fieldCount;
                    if (typeof fieldCountPrevRow === 'undefined') {
                        fieldCountPrevRow = fieldCount;
                        continue;
                    } else if (fieldCount > 0) {
                        delta += Math.abs(fieldCount - fieldCountPrevRow);
                        fieldCountPrevRow = fieldCount;
                    }
                }
                if (preview.data.length > 0) avgFieldCount /= preview.data.length - emptyLinesCount;
                if ((typeof bestDelta === 'undefined' || delta <= bestDelta) && (typeof maxFieldCount === 'undefined' || avgFieldCount > maxFieldCount) && avgFieldCount > 1.99) {
                    bestDelta = delta;
                    bestDelim = delim;
                    maxFieldCount = avgFieldCount;
                }
            }
            _config.delimiter = bestDelim;
            return {
                successful: !!bestDelim,
                bestDelimiter: bestDelim
            };
        }
        function addError(type, code, msg, row) {
            var error = {
                type: type,
                code: code,
                message: msg
            };
            if (row !== undefined) {
                error.row = row;
            }
            _results.errors.push(error);
        }
    }
    /** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions */ function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    /** The core parser implements speedy and correct CSV parsing */ function Parser(config) {
        // Unpack the config object
        config = config || {};
        var delim = config.delimiter;
        var newline = config.newline;
        var comments = config.comments;
        var step = config.step;
        var preview = config.preview;
        var fastMode = config.fastMode;
        var quoteChar;
        var renamedHeaders = null;
        var headerParsed = false;
        if (config.quoteChar === undefined || config.quoteChar === null) {
            quoteChar = '"';
        } else {
            quoteChar = config.quoteChar;
        }
        var escapeChar = quoteChar;
        if (config.escapeChar !== undefined) {
            escapeChar = config.escapeChar;
        }
        // Delimiter must be valid
        if (typeof delim !== 'string' || Papa.BAD_DELIMITERS.indexOf(delim) > -1) delim = ',';
        // Comment character must be valid
        if (comments === delim) throw new Error('Comment character same as delimiter');
        else if (comments === true) comments = '#';
        else if (typeof comments !== 'string' || Papa.BAD_DELIMITERS.indexOf(comments) > -1) comments = false;
        // Newline must be valid: \r, \n, or \r\n
        if (newline !== '\n' && newline !== '\r' && newline !== '\r\n') newline = '\n';
        // We're gonna need these at the Parser scope
        var cursor = 0;
        var aborted = false;
        this.parse = function(input, baseIndex, ignoreLastRow) {
            // For some reason, in Chrome, this speeds things up (!?)
            if (typeof input !== 'string') throw new Error('Input must be a string');
            // We don't need to compute some of these every time parse() is called,
            // but having them in a more local scope seems to perform better
            var inputLen = input.length, delimLen = delim.length, newlineLen = newline.length, commentsLen = comments.length;
            var stepIsFunction = isFunction(step);
            // Establish starting state
            cursor = 0;
            var data = [], errors = [], row = [], lastCursor = 0;
            if (!input) return returnable();
            if (fastMode || fastMode !== false && input.indexOf(quoteChar) === -1) {
                var rows = input.split(newline);
                for(var i = 0; i < rows.length; i++){
                    row = rows[i];
                    cursor += row.length;
                    if (i !== rows.length - 1) cursor += newline.length;
                    else if (ignoreLastRow) return returnable();
                    if (comments && row.substring(0, commentsLen) === comments) continue;
                    if (stepIsFunction) {
                        data = [];
                        pushRow(row.split(delim));
                        doStep();
                        if (aborted) return returnable();
                    } else pushRow(row.split(delim));
                    if (preview && i >= preview) {
                        data = data.slice(0, preview);
                        return returnable(true);
                    }
                }
                return returnable();
            }
            var nextDelim = input.indexOf(delim, cursor);
            var nextNewline = input.indexOf(newline, cursor);
            var quoteCharRegex = new RegExp(escapeRegExp(escapeChar) + escapeRegExp(quoteChar), 'g');
            var quoteSearch = input.indexOf(quoteChar, cursor);
            // Parser loop
            for(;;){
                // Field has opening quote
                if (input[cursor] === quoteChar) {
                    // Start our search for the closing quote where the cursor is
                    quoteSearch = cursor;
                    // Skip the opening quote
                    cursor++;
                    for(;;){
                        // Find closing quote
                        quoteSearch = input.indexOf(quoteChar, quoteSearch + 1);
                        //No other quotes are found - no other delimiters
                        if (quoteSearch === -1) {
                            if (!ignoreLastRow) {
                                // No closing quote... what a pity
                                errors.push({
                                    type: 'Quotes',
                                    code: 'MissingQuotes',
                                    message: 'Quoted field unterminated',
                                    row: data.length,
                                    index: cursor
                                });
                            }
                            return finish();
                        }
                        // Closing quote at EOF
                        if (quoteSearch === inputLen - 1) {
                            var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
                            return finish(value);
                        }
                        // If this quote is escaped, it's part of the data; skip it
                        // If the quote character is the escape character, then check if the next character is the escape character
                        if (quoteChar === escapeChar && input[quoteSearch + 1] === escapeChar) {
                            quoteSearch++;
                            continue;
                        }
                        // If the quote character is not the escape character, then check if the previous character was the escape character
                        if (quoteChar !== escapeChar && quoteSearch !== 0 && input[quoteSearch - 1] === escapeChar) {
                            continue;
                        }
                        if (nextDelim !== -1 && nextDelim < quoteSearch + 1) {
                            nextDelim = input.indexOf(delim, quoteSearch + 1);
                        }
                        if (nextNewline !== -1 && nextNewline < quoteSearch + 1) {
                            nextNewline = input.indexOf(newline, quoteSearch + 1);
                        }
                        // Check up to nextDelim or nextNewline, whichever is closest
                        var checkUpTo = nextNewline === -1 ? nextDelim : Math.min(nextDelim, nextNewline);
                        var spacesBetweenQuoteAndDelimiter = extraSpaces(checkUpTo);
                        // Closing quote followed by delimiter or 'unnecessary spaces + delimiter'
                        if (input.substr(quoteSearch + 1 + spacesBetweenQuoteAndDelimiter, delimLen) === delim) {
                            row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
                            cursor = quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen;
                            // If char after following delimiter is not quoteChar, we find next quote char position
                            if (input[quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen] !== quoteChar) {
                                quoteSearch = input.indexOf(quoteChar, cursor);
                            }
                            nextDelim = input.indexOf(delim, cursor);
                            nextNewline = input.indexOf(newline, cursor);
                            break;
                        }
                        var spacesBetweenQuoteAndNewLine = extraSpaces(nextNewline);
                        // Closing quote followed by newline or 'unnecessary spaces + newLine'
                        if (input.substring(quoteSearch + 1 + spacesBetweenQuoteAndNewLine, quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen) === newline) {
                            row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
                            saveRow(quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen);
                            nextDelim = input.indexOf(delim, cursor); // because we may have skipped the nextDelim in the quoted field
                            quoteSearch = input.indexOf(quoteChar, cursor); // we search for first quote in next line
                            if (stepIsFunction) {
                                doStep();
                                if (aborted) return returnable();
                            }
                            if (preview && data.length >= preview) return returnable(true);
                            break;
                        }
                        // Checks for valid closing quotes are complete (escaped quotes or quote followed by EOF/delimiter/newline) -- assume these quotes are part of an invalid text string
                        errors.push({
                            type: 'Quotes',
                            code: 'InvalidQuotes',
                            message: 'Trailing quote on quoted field is malformed',
                            row: data.length,
                            index: cursor
                        });
                        quoteSearch++;
                        continue;
                    }
                    continue;
                }
                // Comment found at start of new line
                if (comments && row.length === 0 && input.substring(cursor, cursor + commentsLen) === comments) {
                    if (nextNewline === -1) return returnable();
                    cursor = nextNewline + newlineLen;
                    nextNewline = input.indexOf(newline, cursor);
                    nextDelim = input.indexOf(delim, cursor);
                    continue;
                }
                // Next delimiter comes before next newline, so we've reached end of field
                if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1)) {
                    row.push(input.substring(cursor, nextDelim));
                    cursor = nextDelim + delimLen;
                    // we look for next delimiter char
                    nextDelim = input.indexOf(delim, cursor);
                    continue;
                }
                // End of row
                if (nextNewline !== -1) {
                    row.push(input.substring(cursor, nextNewline));
                    saveRow(nextNewline + newlineLen);
                    if (stepIsFunction) {
                        doStep();
                        if (aborted) return returnable();
                    }
                    if (preview && data.length >= preview) return returnable(true);
                    continue;
                }
                break;
            }
            return finish();
            "TURBOPACK unreachable";
            function pushRow(row) {
                data.push(row);
                lastCursor = cursor;
            }
            /**
             * checks if there are extra spaces after closing quote and given index without any text
             * if Yes, returns the number of spaces
             */ function extraSpaces(index) {
                var spaceLength = 0;
                if (index !== -1) {
                    var textBetweenClosingQuoteAndIndex = input.substring(quoteSearch + 1, index);
                    if (textBetweenClosingQuoteAndIndex && textBetweenClosingQuoteAndIndex.trim() === '') {
                        spaceLength = textBetweenClosingQuoteAndIndex.length;
                    }
                }
                return spaceLength;
            }
            /**
			 * Appends the remaining input from cursor to the end into
			 * row, saves the row, calls step, and returns the results.
			 */ function finish(value) {
                if (ignoreLastRow) return returnable();
                if (typeof value === 'undefined') value = input.substring(cursor);
                row.push(value);
                cursor = inputLen; // important in case parsing is paused
                pushRow(row);
                if (stepIsFunction) doStep();
                return returnable();
            }
            /**
			 * Appends the current row to the results. It sets the cursor
			 * to newCursor and finds the nextNewline. The caller should
			 * take care to execute user's step function and check for
			 * preview and end parsing if necessary.
			 */ function saveRow(newCursor) {
                cursor = newCursor;
                pushRow(row);
                row = [];
                nextNewline = input.indexOf(newline, cursor);
            }
            /** Returns an object with the results, errors, and meta. */ function returnable(stopped) {
                if (config.header && !baseIndex && data.length && !headerParsed) {
                    const result = data[0];
                    const headerCount = {}; // To track the count of each base header
                    const usedHeaders = new Set(result); // To track used headers and avoid duplicates
                    let duplicateHeaders = false;
                    for(let i = 0; i < result.length; i++){
                        let header = result[i];
                        if (isFunction(config.transformHeader)) header = config.transformHeader(header, i);
                        if (!headerCount[header]) {
                            headerCount[header] = 1;
                            result[i] = header;
                        } else {
                            let newHeader;
                            let suffixCount = headerCount[header];
                            // Find a unique new header
                            do {
                                newHeader = `${header}_${suffixCount}`;
                                suffixCount++;
                            }while (usedHeaders.has(newHeader))
                            usedHeaders.add(newHeader); // Mark this new Header as used
                            result[i] = newHeader;
                            headerCount[header]++;
                            duplicateHeaders = true;
                            if (renamedHeaders === null) {
                                renamedHeaders = {};
                            }
                            renamedHeaders[newHeader] = header;
                        }
                        usedHeaders.add(header); // Ensure the original header is marked as used
                    }
                    if (duplicateHeaders) {
                        console.warn('Duplicate headers found and renamed.');
                    }
                    headerParsed = true;
                }
                return {
                    data: data,
                    errors: errors,
                    meta: {
                        delimiter: delim,
                        linebreak: newline,
                        aborted: aborted,
                        truncated: !!stopped,
                        cursor: lastCursor + (baseIndex || 0),
                        renamedHeaders: renamedHeaders
                    }
                };
            }
            /** Executes the user's step function and resets data & errors. */ function doStep() {
                step(returnable());
                data = [];
                errors = [];
            }
        };
        /** Sets the abort flag */ this.abort = function() {
            aborted = true;
        };
        /** Gets the cursor position */ this.getCharIndex = function() {
            return cursor;
        };
    }
    function newWorker() {
        if (!Papa.WORKERS_SUPPORTED) return false;
        var workerUrl = getWorkerBlob();
        var w = new global.Worker(workerUrl);
        w.onmessage = mainThreadReceivedMessage;
        w.id = workerIdCounter++;
        workers[w.id] = w;
        return w;
    }
    /** Callback when main thread receives a message */ function mainThreadReceivedMessage(e) {
        var msg = e.data;
        var worker = workers[msg.workerId];
        var aborted = false;
        if (msg.error) worker.userError(msg.error, msg.file);
        else if (msg.results && msg.results.data) {
            var abort = function() {
                aborted = true;
                completeWorker(msg.workerId, {
                    data: [],
                    errors: [],
                    meta: {
                        aborted: true
                    }
                });
            };
            var handle = {
                abort: abort,
                pause: notImplemented,
                resume: notImplemented
            };
            if (isFunction(worker.userStep)) {
                for(var i = 0; i < msg.results.data.length; i++){
                    worker.userStep({
                        data: msg.results.data[i],
                        errors: msg.results.errors,
                        meta: msg.results.meta
                    }, handle);
                    if (aborted) break;
                }
                delete msg.results; // free memory ASAP
            } else if (isFunction(worker.userChunk)) {
                worker.userChunk(msg.results, handle, msg.file);
                delete msg.results;
            }
        }
        if (msg.finished && !aborted) completeWorker(msg.workerId, msg.results);
    }
    function completeWorker(workerId, results) {
        var worker = workers[workerId];
        if (isFunction(worker.userComplete)) worker.userComplete(results);
        worker.terminate();
        delete workers[workerId];
    }
    function notImplemented() {
        throw new Error('Not implemented.');
    }
    /** Callback when worker thread receives a message */ function workerThreadReceivedMessage(e) {
        var msg = e.data;
        if (typeof Papa.WORKER_ID === 'undefined' && msg) Papa.WORKER_ID = msg.workerId;
        if (typeof msg.input === 'string') {
            global.postMessage({
                workerId: Papa.WORKER_ID,
                results: Papa.parse(msg.input, msg.config),
                finished: true
            });
        } else if (global.File && msg.input instanceof File || msg.input instanceof Object) {
            var results = Papa.parse(msg.input, msg.config);
            if (results) global.postMessage({
                workerId: Papa.WORKER_ID,
                results: results,
                finished: true
            });
        }
    }
    /** Makes a deep copy of an array or object (mostly) */ function copy(obj) {
        if (typeof obj !== 'object' || obj === null) return obj;
        var cpy = Array.isArray(obj) ? [] : {};
        for(var key in obj)cpy[key] = copy(obj[key]);
        return cpy;
    }
    function bindFunction(f, self1) {
        return function() {
            f.apply(self1, arguments);
        };
    }
    function isFunction(func) {
        return typeof func === 'function';
    }
    return Papa;
});
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__7238ed58._.js.map