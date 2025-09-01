        class ColorPaletteGenerator {
            constructor() {
                this.currentPalette = [];
                this.savedPalettes = this.loadSavedPalettes();
                this.stats = {
                    generated: parseInt(localStorage.getItem('generatedCount')) || 0,
                    saved: parseInt(localStorage.getItem('savedCount')) || 0,
                    copied: parseInt(localStorage.getItem('copiedCount')) || 0
                };
                
                this.colorPsychology = {
                    energetic: { hue: [0, 30, 330], saturation: [70, 90], lightness: [45, 65] },
                    calm: { hue: [180, 240], saturation: [30, 60], lightness: [60, 80] },
                    creative: { hue: [270, 330, 30, 60], saturation: [60, 85], lightness: [50, 70] },
                    professional: { hue: [200, 240], saturation: [20, 50], lightness: [30, 70] },
                    warm: { hue: [0, 60], saturation: [50, 80], lightness: [40, 70] },
                    nature: { hue: [60, 180], saturation: [40, 70], lightness: [35, 75] }
                };

                this.harmonyRules = {
                    complementary: (baseHue) => [baseHue, (baseHue + 180) % 360],
                    triadic: (baseHue) => [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360],
                    analogous: (baseHue) => [baseHue, (baseHue + 30) % 360, (baseHue - 30 + 360) % 360],
                    splitComplementary: (baseHue) => [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360],
                    tetradic: (baseHue) => [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360],
                    monochromatic: (baseHue) => [baseHue, baseHue, baseHue, baseHue, baseHue]
                };

                this.colorNames = [
                    { name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#000080' }, { name: 'DarkBlue', hex: '#00008B' }, { name: 'MediumBlue', hex: '#0000CD' }, { name: 'Blue', hex: '#0000FF' },
                    { name: 'DarkGreen', hex: '#006400' }, { name: 'Green', hex: '#008000' }, { name: 'Teal', hex: '#008080' }, { name: 'DarkCyan', hex: '#008B8B' }, { name: 'DeepSkyBlue', hex: '#00BFFF' },
                    { name: 'DarkTurquoise', hex: '#00CED1' }, { name: 'MediumSpringGreen', hex: '#00FA9A' }, { name: 'Lime', hex: '#00FF00' }, { name: 'SpringGreen', hex: '#00FF7F' }, { name: 'Aqua', hex: '#00FFFF' },
                    { name: 'Cyan', hex: '#00FFFF' }, { name: 'MidnightBlue', hex: '#191970' }, { name: 'DodgerBlue', hex: '#1E90FF' }, { name: 'LightSeaGreen', hex: '#20B2AA' }, { name: 'ForestGreen', hex: '#228B22' },
                    { name: 'SeaGreen', hex: '#2E8B57' }, { name: 'DarkSlateGray', hex: '#2F4F4F' }, { name: 'Limit', hex: '#32CD32' }, { name: 'MediumAquaMarine', hex: '#66CDAA' }, { name: 'MediumSeaGreen', hex: '#3CB371' },
                    { name: 'DarkSlateBlue', hex: '#483D8B' }, { name: 'SlateBlue', hex: '#6A5ACD' }, { name: 'OliveDrab', hex: '#6B8E23' }, { name: 'CornflowerBlue', hex: '#6495ED' }, { name: 'MediumSlateBlue', hex: '#7B68EE' },
                    { name: 'RoyalBlue', hex: '#4169E1' }, { name: 'LightSteelBlue', hex: '#B0C4DE' }, { name: 'LightSlateGray', hex: '#778899' }, { name: 'SlateGray', hex: '#708090' }, { name: 'SteelBlue', hex: '#4682B4' },
                    { name: 'CadetBlue', hex: '#5F9EA0' }, { name: 'MediumPurple', hex: '#9370DB' }, { name: 'DarkOliveGreen', hex: '#556B2F' }, { name: 'Indigo', hex: '#4B0082' }, { name: 'DarkKhaki', hex: '#BDB76B' },
                    { name: 'Goldenrod', hex: '#DAA520' }, { name: 'DarkGoldenrod', hex: '#B8860B' }, { name: 'Peru', hex: '#CD853F' }, { name: 'Chocolate', hex: '#D2691E' }, { name: 'SaddleBrown', hex: '#8B4513' },
                    { name: 'Sienna', hex: '#A0522D' }, { name: 'Brown', hex: '#A52A2A' }, { name: 'Maroon', hex: '#800000' }, { name: 'DarkRed', hex: '#8B0000' }, { name: 'Red', hex: '#FF0000' },
                    { name: 'Crimson', hex: '#DC143C' }, { name: 'FireBrick', hex: '#B22222' }, { name: 'IndianRed', hex: '#CD5C5C' }, { name: 'LightCoral', hex: '#F08080' }, { name: 'Salmon', hex: '#FA8072' },
                    { name: 'DarkSalmon', hex: '#E9967A' }, { name: 'LightSalmon', hex: '#FFA07A' }, { name: 'OrangeRed', hex: '#FF4500' }, { name: 'Tomato', hex: '#FF6347' }, { name: 'DarkOrange', hex: '#FF8C00' },
                    { name: 'Orange', hex: '#FFA500' }, { name: 'Gold', hex: '#FFD700' }, { name: 'Yellow', hex: '#FFFF00' }, { name: 'LightYellow', hex: '#FFFFE0' }, { name: 'LemonChiffon', hex: '#FFFACD' },
                    { name: 'LightGoldenrodYellow', hex: '#FAFAD2' }, { name: 'PapayaWhip', hex: '#FFEFD5' }, { name: 'Moccasin', hex: '#FFE4B5' }, { name: 'PeachPuff', hex: '#FFDAB9' }, { name: 'PaleGoldenrod', hex: '#EEE8AA' },
                    { name: 'Khaki', hex: '#F0E68C' }, { name: 'DarkSeaGreen', hex: '#8FBC8F' }, { name: 'MediumAquaMarine', hex: '#66CDAA' }, { name: 'MediumSpringGreen', hex: '#00FA9A' }, { name: 'LightGreen', hex: '#90EE90' },
                    { name: 'PaleGreen', hex: '#98FB98' }, { name: 'DarkSeaGreen', hex: '#8FBC8F' }, { name: 'LimeGreen', hex: '#32CD32' }, { name: 'SeaGreen', hex: '#2E8B57' }, { name: 'ForestGreen', hex: '#228B22' },
                    { name: 'GreenYellow', hex: '#ADFF2F' }, { name: 'Chartreuse', hex: '#7FFF00' }, { name: 'LawnGreen', hex: '#7CFC00' }, { name: 'MediumOrchid', hex: '#BA55D3' }, { name: 'DarkOrchid', hex: '#9932CC' },
                    { name: 'DarkViolet', hex: '#9400D3' }, { name: 'BlueViolet', hex: '#8A2BE2' }, { name: 'Purple', hex: '#800080' }, { name: 'MediumPurple', hex: '#9370DB' }, { name: 'Thistle', hex: '#D8BFD8' },
                    { name: 'Plum', hex: '#DDA0DD' }, { name: 'Violet', hex: '#EE82EE' }, { name: 'Orchid', hex: '#DA70D6' }, { name: 'Fuchsia', hex: '#FF00FF' }, { name: 'Magenta', hex: '#FF00FF' },
                    { name: 'MediumVioletRed', hex: '#C71585' }, { name: 'PaleVioletRed', hex: '#DB7093' }, { name: 'DeepPink', hex: '#FF1493' }, { name: 'HotPink', hex: '#FF69B4' }, { name: 'LightPink', hex: '#FFB6C1' },
                    { name: 'Pink', hex: '#FFC0CB' }, { name: 'AntiqueWhite', hex: '#FAEBD7' }, { name: 'Beige', hex: '#F5F5DC' }, { name: 'Bisque', hex: '#FFE4C4' }, { name: 'BlanchedAlmond', hex: '#FFEBCD' },
                    { name: 'Wheat', hex: '#F5DEB3' }, { name: 'Cornsilk', hex: '#FFF8DC' }, { name: 'OldLace', hex: '#FDF5E6' }, { name: 'FloralWhite', hex: '#FFFAF0' }, { name: 'GhostWhite', hex: '#F8F8FF' },
                    { name: 'Honeydew', hex: '#F0FFF0' }, { name: 'Ivory', hex: '#FFFFF0' }, { name: 'LavenderBlush', hex: '#FFF0F5' }, { name: 'Linen', hex: '#FAF0E6' }, { name: 'MistyRose', hex: '#FFE4E1' },
                    { name: 'NavajoWhite', hex: '#FFDEAD' }, { name: 'OldLace', hex: '#FDF5E6' }, { name: 'Orange', hex: '#FFA500' }, { name: 'Orchid', hex: '#DA70D6' }, { name: 'PaleGoldenrod', hex: '#EEE8AA' },
                    { name: 'PaleGreen', hex: '#98FB98' }, { name: 'PaleTurquoise', hex: '#AFEEEE' }, { name: 'PaleVioletRed', hex: '#DB7093' }, { name: 'PapayaWhip', hex: '#FFEFD5' }, { name: 'PeachPuff', hex: '#FFDAB9' },
                    { name: 'Peru', hex: '#CD853F' }, { name: 'Pink', hex: '#FFC0CB' }, { name: 'Plum', hex: '#DDA0DD' }, { name: 'PowderBlue', hex: '#B0E0E6' }, { name: 'Purple', hex: '#800080' },
                    { name: 'Red', hex: '#FF0000' }, { name: 'RosyBrown', hex: '#BC8F8F' }, { name: 'RoyalBlue', hex: '#4169E1' }, { name: 'SaddleBrown', hex: '#8B4513' }, { name: 'Salmon', hex: '#FA8072' },
                    { name: 'SandyBrown', hex: '#F4A460' }, { name: 'SeaGreen', hex: '#2E8B57' }, { name: 'SeaShell', hex: '#FFF5EE' }, { name: 'Sienna', hex: '#A0522D' }, { name: 'Silver', hex: '#C0C0C0' },
                    { name: 'SkyBlue', hex: '#87CEEB' }, { name: 'SlateBlue', hex: '#6A5ACD' }, { name: 'SlateGray', hex: '#708090' }, { name: 'Snow', hex: '#FFFAFA' }, { name: 'SpringGreen', hex: '#00FF7F' },
                    { name: 'SteelBlue', hex: '#4682B4' }, { name: 'Tan', hex: '#D2B48C' }, { name: 'Teal', hex: '#008080' }, { name: 'Thistle', hex: '#D8BFD8' }, { name: 'Tomato', hex: '#FF6347' },
                    { name: 'Turquoise', hex: '#40E0D0' }, { name: 'Violet', hex: '#EE82EE' }, { name: 'Wheat', hex: '#F5DEB3' }, { name: 'White', hex: '#FFFFFF' }, { name: 'WhiteSmoke', hex: '#F5F5F5' },
                    { name: 'Yellow', hex: '#FFFF00' }, { name: 'YellowGreen', hex: '#9ACD32' }
                ];

                this.colorPsychologyDescriptions = {
                    energetic: "This palette is designed to evoke energy and excitement, often featuring vibrant and bold hues.",
                    calm: "A serene and peaceful palette, utilizing soft and muted tones to create a sense of tranquility.",
                    creative: "An imaginative and artistic palette, combining diverse colors to inspire innovation and originality.",
                    professional: "A sophisticated and reliable palette, typically using understated and harmonious colors for a polished look.",
                    warm: "A cozy and inviting palette, dominated by warm tones that bring comfort and cheerfulness.",
                    nature: "Inspired by the natural world, this palette features earthy and organic colors for a grounded feel."
                };

                this.harmonyDescriptions = {
                    complementary: "Uses colors opposite each other on the color wheel for high contrast and vibrancy.",
                    triadic: "Employs three colors equally spaced on the color wheel, offering a balanced and rich palette.",
                    analogous: "Features colors next to each other on the color wheel, creating a harmonious and comfortable feel.",
                    splitComplementary: "A variation of complementary, using a base color and the two colors adjacent to its complement, offering strong contrast without the harshness.",
                    tetradic: "Consists of two complementary pairs, forming a rectangle on the color wheel, providing a rich and varied palette.",
                    monochromatic: "Derived from a single base hue and extended using its shades, tones, and tints, for a subtle and cohesive look."
                };

                this.init();
            }

            init() {
                this.createParticles();
                this.updateStats();
                this.renderSavedPalettes();
                this.bindEvents();
                this.generatePalette();
            }

            createParticles() {
                const container = document.getElementById('particles');
                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 6 + 's';
                    particle.style.animationDuration = (3 + Math.random() * 3) + 's';
                    container.appendChild(particle);
                }
            }

            bindEvents() {
                document.getElementById('generateBtn').addEventListener('click', () => this.generatePalette());
                document.getElementById('saveBtn').addEventListener('click', () => this.savePalette());
                document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPalette());
                document.getElementById('shuffleBtn').addEventListener('click', () => this.shufflePalette());
                
                document.getElementById('harmonySelect').addEventListener('change', () => this.generatePalette());
                document.getElementById('moodSelect').addEventListener('change', () => this.generatePalette());

                document.addEventListener('keydown', (event) => {
                    if (event.code === 'Space') {
                        event.preventDefault(); // Prevent scrolling down
                        document.getElementById('generateBtn').click();
                        this.showToast('Generating palette...');
                    }
                });
            }

            hslToHex(h, s, l) {
                l /= 100;
                const a = s * Math.min(l, 1 - l) / 100;
                const f = n => {
                    const k = (n + h / 30) % 12;
                    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                    return Math.round(255 * color).toString(16).padStart(2, '0');
                };
                return `#${f(0)}${f(8)}${f(4)}`;
            }

            hexToRgb(hex) {
                const r = parseInt(hex.substring(1, 3), 16);
                const g = parseInt(hex.substring(3, 5), 16);
                const b = parseInt(hex.substring(5, 7), 16);
                return { r, g, b };
            }

            getColorName(hex) {
                const rgb = this.hexToRgb(hex);
                let closestMatch = null;
                let minDistance = Infinity;

                for (const color of this.colorNames) {
                    const targetRgb = this.hexToRgb(color.hex);
                    const distance = Math.sqrt(
                        Math.pow(rgb.r - targetRgb.r, 2) +
                        Math.pow(rgb.g - targetRgb.g, 2) +
                        Math.pow(rgb.b - targetRgb.b, 2)
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestMatch = color.name;
                    }
                }
                return closestMatch || hex; // Fallback to hex if no name found
            }

            generatePalette() {
                const harmony = document.getElementById('harmonySelect').value;
                const mood = document.getElementById('moodSelect').value;
                const generateBtn = document.getElementById('generateBtn');
                
                generateBtn.classList.add('generating');
                
                setTimeout(() => {
                    const psychology = this.colorPsychology[mood];
                    const baseHue = psychology.hue[Math.floor(Math.random() * psychology.hue.length)];
                    const hues = this.harmonyRules[harmony](baseHue);
                    
                    this.currentPalette = [];
                    
                    for (let i = 0; i < 5; i++) {
                        let hue = hues[i % hues.length];
                        
                        if (harmony === 'monochromatic') {
                            hue = baseHue + (i - 2) * 15;
                            if (hue < 0) hue += 360;
                            if (hue >= 360) hue -= 360;
                        }
                        
                        const saturation = psychology.saturation[0] + 
                            Math.random() * (psychology.saturation[1] - psychology.saturation[0]);
                        const lightness = psychology.lightness[0] + 
                            Math.random() * (psychology.lightness[1] - psychology.lightness[0]);
                        
                        const hex = this.hslToHex(hue, saturation, lightness);
                        const name = this.getColorName(hex);
                        
                        this.currentPalette.push({
                            hex,
                            hsl: `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`,
                            name,
                            hue: Math.round(hue),
                            saturation: Math.round(saturation),
                            lightness: Math.round(lightness)
                        });
                    }
                    
                    this.currentPalette.harmony = harmony;
                    this.currentPalette.mood = mood;
                    this.currentPalette.harmonyDescription = this.harmonyDescriptions[harmony];
                    this.currentPalette.moodDescription = this.colorPsychologyDescriptions[mood];

                    this.renderPalette();
                    this.updateStats('generated');
                    generateBtn.classList.remove('generating');
                }, 500);
            }

            renderPalette() {
                const grid = document.getElementById('paletteGrid');
                grid.innerHTML = '';
                
                this.currentPalette.forEach((color, index) => {
                    const card = document.createElement('div');
                    card.className = 'color-card';
                    card.style.backgroundColor = color.hex;
                    card.style.animationDelay = `${index * 0.1}s`;
                    
                    card.innerHTML = `
                        <button class="copy-btn" onclick="paletteGen.copyColor('${color.hex}')">📋</button>
                        <div class="color-info">
                            <div class="color-hex">${color.hex}</div>
                            <div class="color-name">${color.name}</div>
                        </div>
                    `;
                    
                    card.addEventListener('click', () => this.copyColor(color.hex));
                    grid.appendChild(card);
                });

                const descriptionDiv = document.getElementById('paletteDescription');
                if (this.currentPalette.length > 0) {
                    const colorNames = this.currentPalette.map(c => c.name).join(', ');
                    const harmonyDesc = this.currentPalette.harmonyDescription;
                    const moodDesc = this.currentPalette.moodDescription;
                    descriptionDiv.innerHTML = `
                        <strong>Colors:</strong> ${colorNames}<br>
                        <strong>Harmony Rationale:</strong> ${harmonyDesc}<br>
                        <strong>Mood Psychology:</strong> ${moodDesc}
                    `;
                } else {
                    descriptionDiv.innerHTML = '';
                }
            }

            copyColor(hex) {
                navigator.clipboard.writeText(hex).then(() => {
                    this.showToast(`${hex} copied to clipboard!`);
                    this.updateStats('copied');
                });
            }

            showToast(message) {
                const toast = document.getElementById('toast');
                toast.textContent = message;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }

            savePalette() {
                if (this.currentPalette.length === 0) return;
                
                const palette = {
                    id: Date.now(),
                    colors: this.currentPalette,
                    harmony: document.getElementById('harmonySelect').value,
                    mood: document.getElementById('moodSelect').value,
                    date: new Date().toLocaleDateString(),
                    harmonyDescription: this.harmonyDescriptions[document.getElementById('harmonySelect').value],
                    moodDescription: this.colorPsychologyDescriptions[document.getElementById('moodSelect').value]
                };
                
                this.savedPalettes.unshift(palette);
                localStorage.setItem('savedPalettes', JSON.stringify(this.savedPalettes));
                this.renderSavedPalettes();
                this.updateStats('saved', 1);
                this.showToast('Palette saved!');
            }

            loadSavedPalettes() {
                const saved = localStorage.getItem('savedPalettes');
                return saved ? JSON.parse(saved) : [];
            }

            renderSavedPalettes() {
                const grid = document.getElementById('savedGrid');
                grid.innerHTML = '';
                
                if (this.savedPalettes.length === 0) {
                    grid.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center; grid-column: 1/-1;">No saved palettes yet. Generate and save your first palette!</p>';
                    return;
                }
                
                this.savedPalettes.forEach(palette => {
                    const card = document.createElement('div');
                    card.className = 'saved-palette';
                    
                    const colorsHtml = palette.colors.map(color => 
                        `<div class="saved-color" style="background: ${color.hex}" 
                              onclick="paletteGen.copyColor('${color.hex}')" 
                              title="${color.hex}"></div>`
                    ).join('');
                    
                    card.innerHTML = `
                        <div class="saved-colors">${colorsHtml}</div>
                        <div class="saved-info">
                            ${palette.harmony} • ${palette.mood} • ${palette.date}
                        </div>
                        <div class="saved-description">
                            <strong>Colors:</strong> ${palette.colors.map(c => c.name).join(', ')}<br>
                            <strong>Harmony Rationale:</strong> ${palette.harmonyDescription}<br>
                            <strong>Mood Psychology:</strong> ${palette.moodDescription}
                        </div>
                        <button class="delete-btn" onclick="event.stopPropagation(); paletteGen.deletePalette(${palette.id})">x</button>
                    `;
                    card.addEventListener('click', () => this.loadPalette(palette.id));
                    grid.appendChild(card);
                });
            }

            shufflePalette() {
                if (this.currentPalette.length > 0) {
                    // Shuffle the current palette
                    for (let i = this.currentPalette.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [this.currentPalette[i], this.currentPalette[j]] = [this.currentPalette[j], this.currentPalette[i]];
                    }
                    this.renderPalette();
                }
            }

            loadPalette(id) {
                const paletteToLoad = this.savedPalettes.find(palette => palette.id === id);
                if (paletteToLoad) {
                    this.currentPalette = paletteToLoad.colors;
                    document.getElementById('harmonySelect').value = paletteToLoad.harmony;
                    document.getElementById('moodSelect').value = paletteToLoad.mood;
                    this.renderPalette();
                    this.showToast('Palette loaded!');
                }
            }

            deletePalette(id) {
                this.savedPalettes = this.savedPalettes.filter(palette => palette.id !== id);
                localStorage.setItem('savedPalettes', JSON.stringify(this.savedPalettes));
                this.renderSavedPalettes();
                this.updateStats('saved', -1);
                this.showToast('Palette deleted!');
            }

            downloadPalette() {
                if (this.currentPalette.length === 0) return;
                
                const canvas = document.createElement('canvas');
                canvas.width = 1000;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                
                this.currentPalette.forEach((color, index) => {
                    ctx.fillStyle = color.hex;
                    ctx.fillRect(index * 200, 0, 200, 200);
                    
                    // Add color hex text
                    ctx.fillStyle = color.lightness > 50 ? '#000' : '#fff';
                    ctx.font = 'bold 20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(color.hex, index * 200 + 100, 100);
                });
                
                const link = document.createElement('a');
                link.download = `palette-${Date.now()}.png`;
                link.href = canvas.toDataURL();
                link.click();
                
                this.showToast('Palette downloaded!');
            }

            updateStats(type, value = 1) {
                if (type) {
                    this.stats[type] += value;
                    localStorage.setItem(`${type}Count`, this.stats[type]);
                }
                
                document.getElementById('generatedCount').textContent = this.stats.generated;
                document.getElementById('savedCount').textContent = this.stats.saved;
                document.getElementById('copiedCount').textContent = this.stats.copied;
            }
        }

        // Initialize the generator
        const paletteGen = new ColorPaletteGenerator();