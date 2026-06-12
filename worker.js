// Cloudflare Worker — AI Chat endpoint + static asset serving
// POST /api/chat  → calls Workers AI (Llama 3.1 8b)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const { messages } = await request.json();

        const guideContext = `You are a helpful terminal-style assistant for a technical guides site covering macOS, Linux, Windows, networking, security, servers, and installation guides. Answer technical questions clearly and accurately. Keep answers concise but complete. Use plain text — no markdown headers, no bullet asterisks, just clean readable text with newlines for structure. If the user asks something completely unrelated to technology or computing, politely say you focus on OS and installation topics.

The site has guides covering these topics:
macOS: sudo issues, Homebrew, Automator, Disk Utility, Time Machine, FileVault, Gatekeeper, SSH keys, Terminal customization, Spotlight, iCloud, Keychain, system preferences, network diagnostics, QuickLook, iTerm2, Oh My Zsh, Xcode tools, screen sharing, disk space, screenshots, recovery mode, migration assistant
Linux: bash scripting, file permissions, SSH, systemd, cron jobs, disk management, LVM, users and groups, process management, networking commands, firewall (ufw, iptables), package managers (apt, dnf, pacman), containers (Docker, Podman), namespaces, kernel parameters, log management, disk encryption (LUKS), hardware info, strace debugging
Windows: WSL2, PowerShell, BitLocker, registry, OpenSSH, performance tweaks, Chocolatey, Windows Terminal, GUI apps in WSL2
Networking & DNS: DNS troubleshooting, Pi-hole, AdGuard, WireGuard VPN, OpenVPN, Tailscale, nmap, tcpdump, IPv6, DDNS, port scanning, DNS over HTTPS, site-to-site VPN
Security: SSH hardening, Fail2ban, CrowdSec, 2FA, Lynis auditing, file encryption (age, GPG), LUKS, Linux hardening checklist
Server & Self-Hosting: Docker Compose, Nginx, Caddy, Traefik, Jellyfin, Nextcloud, Vaultwarden, Home Assistant, Prometheus, Grafana, WireGuard, Tailscale, Gitea, restic backups, Portainer, Uptime Kuma, Pi-hole, AdGuard
Installation Guides: Arch Linux + Hyprland, Ubuntu Server, Fedora, Debian, macOS on USB, Windows 11, Proxmox, TrueNAS, OCLP for unsupported Macs, ChromeOS Flex, OpenWrt`;

        const systemMessage = { role: 'system', content: guideContext };
        const allMessages = [systemMessage, ...messages.slice(-10)]; // keep last 10 turns

        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
          messages: allMessages,
          max_tokens: 800,
          temperature: 0.3,
        });

        return new Response(JSON.stringify({ response: response.response }), {
          headers: { 'Content-Type': 'application/json' },
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // All other requests handled by static assets
    return env.ASSETS.fetch(request);
  },
};
