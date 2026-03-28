// Catalog data and helpers

const Catalog = {
  cpu: {
    title: "CPU",
    desc: "Choose your processor.",
    options: [
      { id: "i3-10100F", brand: "Intel", name: "Core i3-10100F", socket: "LGA1200", tdp: 65, price: 6499 },
      { id: "i3-12100F", brand: "Intel", name: "Core i3-12100F", socket: "LGA1700", tdp: 58, price: 8999 },
      { id: "i5-10400F", brand: "Intel", name: "Core i5-10400F", socket: "LGA1200", tdp: 65, price: 9999 },
      { id: "r3-4100", brand: "AMD", name: "Ryzen 3 4100", socket: "AM4", tdp: 65, price: 10499 },
      { id: "r5-5500", brand: "AMD", name: "Ryzen 5 5500", socket: "AM4", tdp: 65, price: 10699 },
      { id: "r5-5600", brand: "AMD", name: "Ryzen 5 5600", socket: "AM4", tdp: 65, price: 10999 },
      { id: "i5-11400F", brand: "Intel", name: "Core i5-11400F", socket: "LGA1200", tdp: 65, price: 12999 },
      { id: "i5-12400F", brand: "Intel", name: "Core i5-12400F", socket: "LGA1700", tdp: 65, price: 14999 },
      { id: "r5-5600X", brand: "AMD", name: "Ryzen 5 5600X", socket: "AM4", tdp: 65, price: 15999 },
      { id: "i5-12600K", brand: "Intel", name: "Core i5-12600K", socket: "LGA1700", tdp: 125, price: 18999 },
      { id: "i5-13400F", brand: "Intel", name: "Core i5-13400F", socket: "LGA1700", tdp: 65, price: 19999 },
      { id: "r7-5700X", brand: "AMD", name: "Ryzen 7 5700X", socket: "AM4", tdp: 65, price: 17999 },
      { id: "r5-7600", brand: "AMD", name: "Ryzen 5 7600", socket: "AM5", tdp: 65, price: 20999 },
      { id: "i7-12700K", brand: "Intel", name: "Core i7-12700K", socket: "LGA1700", tdp: 125, price: 34999 },
      { id: "r7-7700", brand: "AMD", name: "Ryzen 7 7700", socket: "AM5", tdp: 65, price: 31999 },
      { id: "i7-13700K", brand: "Intel", name: "Core i7-13700K", socket: "LGA1700", tdp: 125, price: 44999 },
      { id: "r7-7800X3D", brand: "AMD", name: "Ryzen 7 7800X3D", socket: "AM5", tdp: 120, price: 45999 },
      { id: "i9-11900K", brand: "Intel", name: "Core i9-11900K", socket: "LGA1200", tdp: 125, price: 46999 },
      { id: "i9-12900K", brand: "Intel", name: "Core i9-12900K", socket: "LGA1700", tdp: 125, price: 54999 },
      { id: "r9-5900X", brand: "AMD", name: "Ryzen 9 5900X", socket: "AM4", tdp: 105, price: 55999 },
      { id: "i9-13900K", brand: "Intel", name: "Core i9-13900K", socket: "LGA1700", tdp: 125, price: 69999 },
      { id: "r9-7950X", brand: "AMD", name: "Ryzen 9 7950X", socket: "AM5", tdp: 170, price: 72999 },
    ],
  },
  motherboard: {
    title: "Motherboard",
    desc: "Pick a board compatible with your CPU socket.",
    options: [
      { id: "b460-matx", name: "Intel B460 mATX", socket: "LGA1200", form: "mATX", mem: "DDR4", price: 4999 },
      { id: "b560-atx", name: "Intel B560 ATX", socket: "LGA1200", form: "ATX", mem: "DDR4", price: 5999 },
      { id: "b660-ddr4", name: "Intel B660 DDR4 ATX", socket: "LGA1700", form: "ATX", mem: "DDR4", price: 8999 },
      { id: "b660-ddr5", name: "Intel B660 DDR5 ATX", socket: "LGA1700", form: "ATX", mem: "DDR5", price: 10499 },
      { id: "z690-ddr4", name: "Intel Z690 DDR4 ATX", socket: "LGA1700", form: "ATX", mem: "DDR4", price: 12999 },
      { id: "z690-ddr5", name: "Intel Z690 DDR5 ATX", socket: "LGA1700", form: "ATX", mem: "DDR5", price: 14999 },
      { id: "a520-matx", name: "AMD A520 mATX", socket: "AM4", form: "mATX", mem: "DDR4", price: 4499 },
      { id: "b450-atx", name: "AMD B450 ATX", socket: "AM4", form: "ATX", mem: "DDR4", price: 5599 },
      { id: "b550-atx", name: "AMD B550 ATX", socket: "AM4", form: "ATX", mem: "DDR4", price: 7999 },
      { id: "x570-atx", name: "AMD X570 ATX", socket: "AM4", form: "ATX", mem: "DDR4", price: 11999 },
      { id: "a620-matx", name: "AMD A620 mATX", socket: "AM5", form: "mATX", mem: "DDR5", price: 8499 },
      { id: "b650-atx", name: "AMD B650 ATX", socket: "AM5", form: "ATX", mem: "DDR5", price: 12999 },
      { id: "x670e-atx", name: "AMD X670E ATX", socket: "AM5", form: "ATX", mem: "DDR5", price: 21999 },
    ],
  },
  gpu: {
    title: "GPU",
    desc: "Choose your graphics card.",
    options: [
      { id: "gtx-1630", brand: "NVIDIA", name: "GeForce GTX 1630", vram: "4GB", tdp: 75, price: 9999 },
      { id: "gtx-1650", brand: "NVIDIA", name: "GeForce GTX 1650", vram: "4GB", tdp: 75, price: 12999 },
      { id: "gtx-1660s", brand: "NVIDIA", name: "GeForce GTX 1660 Super", vram: "6GB", tdp: 125, price: 17999 },
      { id: "rx-6500xt", brand: "AMD", name: "Radeon RX 6500 XT", vram: "4GB", tdp: 107, price: 16999 },
      { id: "rx-6600", brand: "AMD", name: "Radeon RX 6600", vram: "8GB", tdp: 132, price: 18999 },
      { id: "rx-6650xt", brand: "AMD", name: "Radeon RX 6650 XT", vram: "8GB", tdp: 176, price: 23999 },
      { id: "rtx-3050", brand: "NVIDIA", name: "GeForce RTX 3050", vram: "8GB", tdp: 130, price: 20999 },
      { id: "rtx-3060", brand: "NVIDIA", name: "GeForce RTX 3060", vram: "12GB", tdp: 170, price: 26999 },
      { id: "rx-7600", brand: "AMD", name: "Radeon RX 7600", vram: "8GB", tdp: 165, price: 25999 },
      { id: "rtx-3060ti", brand: "NVIDIA", name: "GeForce RTX 3060 Ti", vram: "8GB", tdp: 200, price: 30999 },
      { id: "rtx-4060", brand: "NVIDIA", name: "GeForce RTX 4060", vram: "8GB", tdp: 115, price: 28999 },
      { id: "rx-6700xt", brand: "AMD", name: "Radeon RX 6700 XT", vram: "12GB", tdp: 230, price: 32999 },
      { id: "rtx-4060ti", brand: "NVIDIA", name: "GeForce RTX 4060 Ti", vram: "8GB/16GB", tdp: 165, price: 34999 },
      { id: "rtx-5060", brand: "NVIDIA", name: "GeForce RTX 5060", vram: "12GB", tdp: 170, price: 36999 },
      { id: "rtx-5060ti-8", brand: "NVIDIA", name: "GeForce RTX 5060 Ti", vram: "8GB", tdp: 185, price: 42999 },
      { id: "rtx-5060ti-16", brand: "NVIDIA", name: "GeForce RTX 5060 Ti", vram: "16GB", tdp: 195, price: 47999 },
      { id: "rx-7700xt", brand: "AMD", name: "Radeon RX 7700 XT", vram: "12GB", tdp: 245, price: 39999 },
      { id: "rtx-4070", brand: "NVIDIA", name: "GeForce RTX 4070", vram: "12GB", tdp: 200, price: 54999 },
      { id: "rx-7800xt", brand: "AMD", name: "Radeon RX 7800 XT", vram: "16GB", tdp: 263, price: 49999 },
      { id: "rtx-4070ti", brand: "NVIDIA", name: "GeForce RTX 4070 Ti", vram: "12GB", tdp: 285, price: 69999 },
      { id: "rx-7900xt", brand: "AMD", name: "Radeon RX 7900 XT", vram: "20GB", tdp: 315, price: 79999 },
      { id: "rtx-4080", brand: "NVIDIA", name: "GeForce RTX 4080", vram: "16GB", tdp: 320, price: 104999 },
      { id: "rtx-4090", brand: "NVIDIA", name: "GeForce RTX 4090", vram: "24GB", tdp: 450, price: 149999 },
      { id: "rtx-5070", brand: "NVIDIA", name: "GeForce RTX 5070", vram: "12GB", tdp: 220, price: 69999 },
      { id: "rtx-5080", brand: "NVIDIA", name: "GeForce RTX 5080", vram: "16GB", tdp: 300, price: 119999 },
      { id: "rtx-5090", brand: "NVIDIA", name: "GeForce RTX 5090", vram: "24GB", tdp: 420, price: 179999 },
    ],
  },
  memory: {
    title: "Memory (RAM)",
    desc: "Pick a RAM kit.",
    options: [
      { id: "8-2666", name: "8GB (1x8) DDR4-2666", type: "DDR4", size: 8, price: 1199 },
      { id: "8-3200", name: "8GB (1x8) DDR4-3200", type: "DDR4", size: 8, price: 1499 },
      { id: "16-3000", name: "16GB (2x8) DDR4-3000", type: "DDR4", size: 16, price: 2699 },
      { id: "16-3200", name: "16GB (2x8) DDR4-3200", type: "DDR4", size: 16, price: 2999 },
      { id: "16-3600", name: "16GB (2x8) DDR4-3600", type: "DDR4", size: 16, price: 3299 },
      { id: "32-3000", name: "32GB (2x16) DDR4-3000", type: "DDR4", size: 32, price: 5499 },
      { id: "32-3200", name: "32GB (2x16) DDR4-3200", type: "DDR4", size: 32, price: 5799 },
      { id: "32-3600", name: "32GB (2x16) DDR4-3600", type: "DDR4", size: 32, price: 6199 },
      { id: "16-4800", name: "16GB (2x8) DDR5-4800", type: "DDR5", size: 16, price: 4599 },
      { id: "16-5600", name: "16GB (2x8) DDR5-5600", type: "DDR5", size: 16, price: 4999 },
      { id: "32-5200", name: "32GB (2x16) DDR5-5200", type: "DDR5", size: 32, price: 7899 },
      { id: "32-5600", name: "32GB (2x16) DDR5-5600", type: "DDR5", size: 32, price: 8999 },
      { id: "32-6000", name: "32GB (2x16) DDR5-6000", type: "DDR5", size: 32, price: 10499 },
      { id: "64-5200", name: "64GB (2x32) DDR5-5200", type: "DDR5", size: 64, price: 18499 },
      { id: "64-5600", name: "64GB (2x32) DDR5-5600", type: "DDR5", size: 64, price: 19999 },
      { id: "64-6000", name: "64GB (2x32) DDR5-6000", type: "DDR5", size: 64, price: 21999 },
      { id: "96-5600", name: "96GB (2x48) DDR5-5600", type: "DDR5", size: 96, price: 29999 },
      { id: "128-5200", name: "128GB (2x64) DDR5-5200", type: "DDR5", size: 128, price: 39999 },
      { id: "128-5600", name: "128GB (2x64) DDR5-5600", type: "DDR5", size: 128, price: 42999 },
      { id: "128-6000", name: "128GB (2x64) DDR5-6000", type: "DDR5", size: 128, price: 45999 },
    ],
  },
  ssd: {
    title: "Storage (SSD)",
    desc: "Choose your SSD.",
    options: [
      { id: "ssd-240", name: "SSD SATA 240GB", type: "SSD", price: 1299 },
      { id: "ssd-500", name: "SSD SATA 500GB", type: "SSD", price: 1999 },
      { id: "ssd-1tb", name: "SSD SATA 1TB", type: "SSD", price: 3299 },
      { id: "sata-2tb", name: "SSD SATA 2TB", type: "SSD", price: 7499 },
      { id: "nvme-256", name: "NVMe PCIe 3.0 256GB", type: "NVMe", price: 1599 },
      { id: "nvme-500", name: "NVMe PCIe 3.0 500GB", type: "NVMe", price: 2499 },
      { id: "nvme-1tb", name: "NVMe PCIe 4.0 1TB", type: "NVMe", price: 4999 },
      { id: "nvme-2tb", name: "NVMe PCIe 4.0 2TB", type: "NVMe", price: 8999 },
      { id: "nvme-4tb", name: "NVMe PCIe 4.0 4TB", type: "NVMe", price: 21999 },
      { id: "nvme-gen5-1tb", name: "NVMe PCIe 5.0 1TB", type: "NVMe", price: 10999 },
      { id: "nvme-gen5-2tb", name: "NVMe PCIe 5.0 2TB", type: "NVMe", price: 18999 },
      { id: "nvme-gen5-4tb", name: "NVMe PCIe 5.0 4TB", type: "NVMe", price: 32999 },
    ],
  },
  hdd: {
    title: "Storage (HDD)",
    desc: "Choose your HDD.",
    options: [
      { id: "hdd-500", name: "HDD 500GB 7200RPM", type: "HDD", price: 1499 },
      { id: "hdd-1tb", name: "HDD 1TB 7200RPM", type: "HDD", price: 2499 },
      { id: "hdd-2tb", name: "HDD 2TB 7200RPM", type: "HDD", price: 3499 },
      { id: "hdd-3tb", name: "HDD 3TB 5400RPM", type: "HDD", price: 4599 },
      { id: "hdd-4tb", name: "HDD 4TB 5400RPM", type: "HDD", price: 5999 },
      { id: "hdd-6tb", name: "HDD 6TB 5400RPM", type: "HDD", price: 8999 },
      { id: "hdd-8tb", name: "HDD 8TB 5400RPM", type: "HDD", price: 11999 },
      { id: "hdd-10tb", name: "HDD 10TB 5400RPM", type: "HDD", price: 16999 },
      { id: "hdd-12tb", name: "HDD 12TB 5400RPM", type: "HDD", price: 20999 },
      { id: "hdd-14tb", name: "HDD 14TB 5400RPM", type: "HDD", price: 26999 },
    ],
  },
  psu: {
    title: "Power Supply",
    desc: "Select wattage and rating.",
    options: [
      { id: "psu-400-white", name: "400W 80+", watt: 400, efficiency: "Standard", price: 1999 },
      { id: "psu-450-bronze", name: "450W 80+ Bronze", watt: 450, efficiency: "Bronze", price: 2499 },
      { id: "psu-500-bronze", name: "500W 80+ Bronze", watt: 500, efficiency: "Bronze", price: 2799 },
      { id: "psu-550-bronze", name: "550W 80+ Bronze", watt: 550, efficiency: "Bronze", price: 2999 },
      { id: "psu-600-bronze", name: "600W 80+ Bronze", watt: 600, efficiency: "Bronze", price: 3199 },
      { id: "psu-650-bronze", name: "650W 80+ Bronze", watt: 650, efficiency: "Bronze", price: 3499 },
      { id: "psu-650-gold", name: "650W 80+ Gold", watt: 650, efficiency: "Gold", price: 5299 },
      { id: "psu-700-gold", name: "700W 80+ Gold", watt: 700, efficiency: "Gold", price: 5999 },
      { id: "psu-750-gold", name: "750W 80+ Gold", watt: 750, efficiency: "Gold", price: 6499 },
      { id: "psu-850-gold", name: "850W 80+ Gold", watt: 850, efficiency: "Gold", price: 7999 },
      { id: "psu-850-platinum", name: "850W 80+ Platinum", watt: 850, efficiency: "Platinum", price: 9999 },
      { id: "psu-1000-gold", name: "1000W 80+ Gold", watt: 1000, efficiency: "Gold", price: 11999 },
      { id: "psu-1000-platinum", name: "1000W 80+ Platinum", watt: 1000, efficiency: "Platinum", price: 13999 },
      { id: "psu-1200-gold", name: "1200W 80+ Gold", watt: 1200, efficiency: "Gold", price: 15999 },
      { id: "psu-1200-platinum", name: "1200W 80+ Platinum", watt: 1200, efficiency: "Platinum", price: 17999 },
      { id: "psu-1300-platinum", name: "1300W 80+ Platinum", watt: 1300, efficiency: "Platinum", price: 21999 },
      { id: "psu-1400-platinum", name: "1400W 80+ Platinum", watt: 1400, efficiency: "Platinum", price: 23999 },
      { id: "psu-1500-platinum", name: "1500W 80+ Platinum", watt: 1500, efficiency: "Platinum", price: 25999 },
      { id: "psu-1600-titanium", name: "1600W 80+ Titanium", watt: 1600, efficiency: "Titanium", price: 27999 },
      { id: "psu-1650-titanium", name: "1650W 80+ Titanium", watt: 1650, efficiency: "Titanium", price: 29999 },
      { id: "psu-1800-titanium", name: "1800W 80+ Titanium", watt: 1800, efficiency: "Titanium", price: 34999 },
    ],
  },
  case: {
    title: "Cabinet",
    desc: "Choose a style.",
    options: [
      { id: "basic-micro", name: "Basic Micro-ATX", form: "Micro-ATX", price: 2499 },
      { id: "micro-atx", name: "Micro-ATX Compact", form: "Micro-ATX", price: 3199 },
      { id: "mesh-mid", name: "Mid Tower Mesh", form: "ATX", price: 3499 },
      { id: "mini-itx", name: "Compact Mini-ITX", form: "Mini-ITX", price: 4499 },
      { id: "glass-mid", name: "Tempered Glass Mid Tower", form: "ATX", price: 4999 },
      { id: "white-mid", name: "White ATX Mid Tower", form: "ATX", price: 5299 },
      { id: "rgb-mid", name: "RGB Mid Tower", form: "ATX", price: 5799 },
      { id: "mesh-mini", name: "Mesh Mini-ITX", form: "Mini-ITX", price: 5799 },
      { id: "silent-atx", name: "Silent ATX Case", form: "ATX", price: 6299 },
      { id: "airflow-atx", name: "High Airflow ATX", form: "ATX", price: 6699 },
      { id: "vertical-gpu", name: "ATX Vertical GPU", form: "ATX", price: 6999 },
      { id: "mesh-white", name: "Mesh ATX White", form: "ATX", price: 7199 },
      { id: "mesh-black", name: "Mesh ATX Black", form: "ATX", price: 7199 },
      { id: "dual-chamber", name: "Dual-Chamber ATX", form: "ATX", price: 8499 },
      { id: "silent-e-atx", name: "Silent E-ATX", form: "E-ATX", price: 9999 },
      { id: "premium-atx", name: "Premium Aluminum ATX", form: "ATX", price: 10999 },
      { id: "premium-itx", name: "Premium Mini-ITX", form: "Mini-ITX", price: 11499 },
      { id: "showcase", name: "Showcase Full Tower", form: "E-ATX", price: 13999 },
      { id: "ultra-showcase", name: "Ultra Showcase Full Tower", form: "E-ATX", price: 17999 },
      { id: "cube-itx", name: "Cube Mini-ITX", form: "Mini-ITX", price: 6299 },
      { id: "compact-atx", name: "Compact ATX", form: "ATX", price: 6899 },
      { id: "silent-matx", name: "Silent Micro-ATX", form: "Micro-ATX", price: 7599 },
      { id: "full-tower", name: "Full Tower E-ATX", form: "E-ATX", price: 15999 },
    ],
  },
  cooler: {
    title: "Cooler",
    desc: "Air or liquid cooling.",
    options: [
      { id: "stock-fan", name: "Stock Cooler", type: "Air", price: 0 },
      { id: "air-80", name: "Air Cooler 80mm", type: "Air", price: 699 },
      { id: "air-92", name: "Air Cooler 92mm", type: "Air", price: 999 },
      { id: "air-120", name: "Air Cooler 120mm", type: "Air", price: 1499 },
      { id: "air-140", name: "Air Cooler 140mm", type: "Air", price: 1999 },
      { id: "tower-120", name: "Tower Cooler 120mm", type: "Air", price: 2499 },
      { id: "tower-140", name: "Tower Cooler 140mm", type: "Air", price: 3299 },
      { id: "dual-tower", name: "Dual Tower 140mm", type: "Air", price: 4999 },
      { id: "aio-120", name: "AIO Liquid 120mm", type: "Liquid", price: 3499 },
      { id: "aio-240", name: "AIO Liquid 240mm", type: "Liquid", price: 5999 },
      { id: "aio-280", name: "AIO Liquid 280mm", type: "Liquid", price: 7499 },
      { id: "aio-360", name: "AIO Liquid 360mm", type: "Liquid", price: 9499 },
      { id: "aio-420", name: "AIO Liquid 420mm", type: "Liquid", price: 11999 },
      { id: "custom-240", name: "Custom Loop 240mm", type: "Liquid", price: 19999 },
      { id: "custom-360", name: "Custom Loop 360mm", type: "Liquid", price: 27999 },
      { id: "custom-480", name: "Custom Loop 480mm", type: "Liquid", price: 35999 },
      { id: "air-200", name: "Air Cooler 200mm", type: "Air", price: 3999 },
      { id: "aio-180", name: "AIO Liquid 180mm", type: "Liquid", price: 5299 },
      { id: "aio-480", name: "AIO Liquid 480mm", type: "Liquid", price: 13999 },
      { id: "custom-600", name: "Custom Loop 600mm", type: "Liquid", price: 45999 },
    ],
  },
  setup: {
    title: "Setup & Security",
    desc: "Operating system, Office, and Antivirus.",
    options: [
      // OS
      { id: "win-home-oem", group: "OS", name: "Windows 11 Home (OEM)", price: 8999 },
      { id: "win-home-retail", group: "OS", name: "Windows 11 Home (Retail)", price: 9999 },
      { id: "win-pro-full", group: "OS", name: "Windows 11 Pro (Full License)", price: 12999 },
      { id: "win-pro-oem", group: "OS", name: "Windows 11 Pro (OEM)", price: 11999 },
      { id: "win-pro-trial", group: "OS", name: "Windows 11 Pro (Trial)", price: 0 },
      { id: "win-10-home", group: "OS", name: "Windows 10 Home (Retail)", price: 5999 },
      { id: "win-10-home-oem", group: "OS", name: "Windows 10 Home (OEM)", price: 5499 },
      { id: "win-10-pro", group: "OS", name: "Windows 10 Pro (Retail)", price: 6999 },
      { id: "win-10-pro-oem", group: "OS", name: "Windows 10 Pro (OEM)", price: 6499 },
      { id: "ubuntu", group: "OS", name: "Ubuntu Linux (Free)", price: 0 },
      { id: "fedora", group: "OS", name: "Fedora Workstation (Free)", price: 0 },
      { id: "mint", group: "OS", name: "Linux Mint (Free)", price: 0 },
      { id: "arch", group: "OS", name: "Arch Linux (Free)", price: 0 },
      // MS Office
      { id: "office-home", group: "MS Office", name: "Microsoft Office Home", price: 6999 },
      { id: "office-student", group: "MS Office", name: "Office Home & Student", price: 7499 },
      { id: "office-business", group: "MS Office", name: "Office Home & Business", price: 9999 },
      { id: "office-pro", group: "MS Office", name: "Microsoft Office Professional", price: 12499 },
      { id: "office-365-basic", group: "MS Office", name: "Microsoft 365 Basic (1 Year)", price: 2899 },
      { id: "office-365-family", group: "MS Office", name: "Microsoft 365 Family (1 Year)", price: 5299 },
      { id: "office-365-business", group: "MS Office", name: "Microsoft 365 Business (1 Year)", price: 8999 },
      { id: "office-trial", group: "MS Office", name: "Microsoft Office (Trial)", price: 0 },
      // Antivirus matrix: devices x durations
      { id: "av-1-3m", group: "Antivirus", name: "Antivirus 1 Device - 3 Months", device: 1, duration: "3m", price: 399 },
      { id: "av-1-6m", group: "Antivirus", name: "Antivirus 1 Device - 6 Months", device: 1, duration: "6m", price: 699 },
      { id: "av-1-1y", group: "Antivirus", name: "Antivirus 1 Device - 1 Year", device: 1, duration: "1y", price: 999 },
      { id: "av-1-2y", group: "Antivirus", name: "Antivirus 1 Device - 2 Years", device: 1, duration: "2y", price: 1699 },
      { id: "av-1-3y", group: "Antivirus", name: "Antivirus 1 Device - 3 Years", device: 1, duration: "3y", price: 2299 },

      { id: "av-2-3m", group: "Antivirus", name: "Antivirus 2 Devices - 3 Months", device: 2, duration: "3m", price: 599 },
      { id: "av-2-6m", group: "Antivirus", name: "Antivirus 2 Devices - 6 Months", device: 2, duration: "6m", price: 999 },
      { id: "av-2-1y", group: "Antivirus", name: "Antivirus 2 Devices - 1 Year", device: 2, duration: "1y", price: 1499 },
      { id: "av-2-2y", group: "Antivirus", name: "Antivirus 2 Devices - 2 Years", device: 2, duration: "2y", price: 2499 },
      { id: "av-2-3y", group: "Antivirus", name: "Antivirus 2 Devices - 3 Years", device: 2, duration: "3y", price: 3299 },

      { id: "av-3-3m", group: "Antivirus", name: "Antivirus 3 Devices - 3 Months", device: 3, duration: "3m", price: 799 },
      { id: "av-3-6m", group: "Antivirus", name: "Antivirus 3 Devices - 6 Months", device: 3, duration: "6m", price: 1299 },
      { id: "av-3-1y", group: "Antivirus", name: "Antivirus 3 Devices - 1 Year", device: 3, duration: "1y", price: 1999 },
      { id: "av-3-2y", group: "Antivirus", name: "Antivirus 3 Devices - 2 Years", device: 3, duration: "2y", price: 3299 },
      { id: "av-3-3y", group: "Antivirus", name: "Antivirus 3 Devices - 3 Years", device: 3, duration: "3y", price: 4399 },
    ],
  },
};

const ComponentOrder = [
  "cpu",
  "motherboard",
  "gpu",
  "memory",
  "ssd",
  "hdd",
  "psu",
  "cooler",
  "case",
  "setup",
];

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
function formatPrice(n){
  const v = Math.round(n || 0);
  console.log('formatPrice input:', n, 'output:', v);
  return INR.format(v);
}

function estimatePower(build){
  const cpu = Catalog.cpu.options.find(o=>o.id===build.cpu);
  const gpu = Catalog.gpu.options.find(o=>o.id===build.gpu);
  const base = 100; // motherboard, drives, fans
  const cpuTDP = cpu?.tdp || 0;
  const gpuTDP = gpu?.tdp || 0;
  return Math.round(base + cpuTDP + gpuTDP * 1.1);
}

function calcTotal(build){
  let sum = 0;
  for(const key of ComponentOrder){
    const val = build[key];
    if(!val) continue;
    if(key === 'setup'){
      // software can include multiple selections as array of ids
      const arr = Array.isArray(val) ? val : [];
      for(const id of arr){
        const opt = Catalog.setup.options.find(o=>o.id===id);
        if(opt) {
          console.log('Adding setup item:', opt.name, 'price:', opt.price);
          sum += opt.price;
        }
      }
    }else{
      const opt = Catalog[key].options.find(o=>o.id===val);
      if(opt) {
        console.log('Adding component:', key, opt.name, 'price:', opt.price);
        sum += opt.price;
      }
    }
  }
  console.log('Final total:', sum);
  return sum;
}
