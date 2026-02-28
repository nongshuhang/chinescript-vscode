// src/extension.ts
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // 原有命令：用于右键、命令面板等
  const runCommand = vscode.commands.registerCommand('chinescript.runFile', async (uri?: vscode.Uri) => {
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
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider('chinescript', {
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
    })
  );

  context.subscriptions.push(runCommand);
}

export function deactivate() {}