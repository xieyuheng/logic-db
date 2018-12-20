module.exports = {
    title: "logic-db",
    description: "combine logic programming and database in js",
    themeConfig: {
        repo: "xieyuheng/logic-db",
        docsRepo: "xieyuheng/logic-db",
        docsDir: "docs",
        docsBranch: "master",
        editLinks: true,
        sidebar: [
            "/installation",
            "/",
            { title: "SICP", children: [
                "/sicp/",
                "/sicp/a-boston-high-tech-company",
                "/sicp/logic-as-programs",
            ] },
            { title: "C&E", children: [
                "/clause-and-effect/",
                "/clause-and-effect/worksheet-01-party-pairs",
            ] },
        ],
    },
}
