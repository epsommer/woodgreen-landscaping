'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = MyDocument;
const document_1 = require('next/document');
function MyDocument() {
    return (<document_1.Html lang="en">
			<document_1.Head></document_1.Head>
			<body>
				<document_1.Main />
				<document_1.NextScript />
			</body>
		</document_1.Html>);
}
