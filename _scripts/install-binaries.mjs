#!/usr/bin/env zx

/**
 * Install CUE
 */
await $`
cd ./_tmp
wget https://github.com/cue-lang/cue/releases/download/v0.7.0/cue_v0.7.0_linux_amd64.tar.gz
tar -xvf cue_v0.7.0_linux_amd64.tar.gz
sudo mv cue /usr/local/bin
cue version
rm -rf cue_v0.7.0_linux_amd64.tar.gz
`

/**
 * Install SOPS
 */
await $`
cd ./_tmp
curl -LO https://github.com/getsops/sops/releases/download/v3.8.1/sops-v3.8.1.linux.amd64
sudo mv sops-v3.8.1.linux.amd64 /usr/local/bin/sops
chmod +x /usr/local/bin/sops
`