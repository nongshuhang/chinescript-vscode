"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// src/extension.ts
const vscode = __importStar(require("vscode"));
function activate(context) {
    // 原有命令：用于右键、命令面板等
    const runCommand = vscode.commands.registerCommand('chinescript.runFile', async (uri) => {
        let filePath = uri?.fsPath;
        if (!filePath) {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'chinescript') {
                vscode.window.showErrorMessage('请打开一个 .ch 文件');
                return;
            }
            await editor.document.save();
            filePath = editor.document.fileName;
        }
        // ✅ 直接调用 ch.exe（假设已加入 PATH）
        const terminal = vscode.window.createTerminal('ChineScript');
        terminal.sendText(`ch "${filePath}"`, true);
        terminal.show();
    });
    // 👇 关键：注册 DebugConfigurationProvider
    // 当用户点击 ▶️ 时，VS Code 会调用此函数
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('chinescript', {
        resolveDebugConfiguration(folder, config, token) {
            // 获取当前文件
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor || activeEditor.document.languageId !== 'chinescript') {
                vscode.window.showErrorMessage('请打开一个 .ch 文件');
                return undefined; // 取消启动
            }
            const filePath = activeEditor.document.fileName;
            // ✅ 直接执行运行命令！
            vscode.commands.executeCommand('chinescript.runFile', vscode.Uri.file(filePath));
            // 返回 undefined 表示“不启动调试器”
            return undefined;
        }
    }));
    context.subscriptions.push(runCommand);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map