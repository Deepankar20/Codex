"use client";
import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface TerminalProps {
  initialCommand?: string;
}

const XTerminalComponent: React.FC<TerminalProps> = ({
  initialCommand = "",
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);

  useEffect(() => {
    // Create terminal instance
    const terminal = new Terminal({
      cursorBlink: true,
      convertEol: true,
      fontFamily: "monospace",
      fontSize: 14,
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
      },
    });

    // Create fit addon for responsive sizing
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    // Render terminal
    if (terminalRef.current) {
      terminal.open(terminalRef.current);
      fitAddon.fit();
    }

    // Store terminal instance
    terminalInstanceRef.current = terminal;

    // Command handling
    terminal.onData((data) => {
      // Local echo (optional)
      terminal.write(data);

      // You can add custom command parsing logic here
      if (data === "\r") {
        // Enter key
        terminal.writeln("");
        // Here you would typically process the command
      }
    });

    // Resize handling
    const handleResize = () => {
      fitAddon.fit();
    };

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Optional: Write initial command or prompt
    if (initialCommand) {
      terminal.writeln(initialCommand);
    } else {
      terminal.writeln("Welcome to XTerm Terminal");
      terminal.writeln("Type your commands here...");
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      terminal.dispose();
    };
  }, [initialCommand]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "#1e1e1e",
      }}
    />
  );
};

export default XTerminalComponent;
