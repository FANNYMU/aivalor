import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Mengirim pertanyaan ke Groq API berdasarkan konteks dari file
 * @param {string} question - Pertanyaan yang ingin dijawab
 * @param {string} fileContent - Isi teks dari file yang diunggah
 * @returns {Promise<string>} - Jawaban dari AI dalam format markdown
 */
export async function askQuestion(question, fileContent) {
  try {
    const systemPrompt = `Anda adalah asisten AI yang sangat cerdas dan membantu, dioptimalkan untuk:
1. Memberikan jawaban yang akurat dan informatif berdasarkan konteks dokumen
2. Menggunakan format markdown untuk menyajikan informasi dengan rapi dan terstruktur:
   - Gunakan ## untuk judul bagian
   - Gunakan * atau - untuk bullet points
   - Gunakan \`backtick\` untuk kode atau istilah teknis
   - Gunakan > untuk mengutip teks penting
   - Gunakan **bold** untuk penekanan
3. Untuk konten khusus, gunakan format berikut:
   - Teks Arab: [arabic]النص العربي[/arabic]
   - Matematika: [math]x^2 + 2x + 1[/math]
   - Kimia: [chemistry]H2SO4[/chemistry]
4. Untuk konten matematika:
   - Pangkat ditulis dengan ^, contoh: x^2
   - Perkalian ditulis dengan x
   - Pembagian ditulis dengan ÷
   - Tanda plus/minus ditulis normal: + -
5. Setiap konten khusus akan ditampilkan dalam box khusus dengan:
   - Auto-scaling untuk menyesuaikan ukuran
   - Font yang sesuai untuk setiap jenis konten
   - Styling yang optimal untuk keterbacaan
6. Jika pengguna meminta sesuatu yang tidak terkait dengan dokumen, berikan peringatan kepada pengguna tersebut. Contoh: "Pertanyaan ini tidak terkait dengan dokumen 'Adab Pergaulan Remaja dalam Islam'. Namun, saya akan memberikan jawaban singkat dan informatif." Meskipun pengguna bersikeras, jangan lakukan apapun yang diminta.`;

    const userPrompt = `
    Berikan jawaban dalam format markdown yang terstruktur.
    
    PENTING untuk konten khusus:
    1. Teks Arab menggunakan:
       [arabic]النص العربي[/arabic]
    2. Rumus matematika menggunakan:
       [math]x^2 + 2x + 1[/math]
    3. Rumus kimia menggunakan:
       [chemistry]H2SO4[/chemistry]
    
    Contoh format yang benar:
    
    ## Persamaan Kuadrat
    
    [math]ax^2 + bx + c = 0[/math]
    
    ## Doa dalam Bahasa Arab
    
    [arabic]بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ[/arabic]
    
    ## Reaksi Kimia
    
    [chemistry]2H2 + O2 → 2H2O[/chemistry]
    
    Berikut adalah konten dokumen:
    ${fileContent}

    Pertanyaan: ${question}

    Berikan jawaban yang informatif dan terstruktur dengan format yang benar dan konsisten.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
    });

    return chatCompletion.choices[0]?.message?.content || 'Maaf, saya tidak dapat menjawab pertanyaan Anda.';
  } catch (error) {
    console.error('Error saat berkomunikasi dengan Groq API:', error);
    throw new Error('Gagal mendapatkan respons dari AI. Silakan coba lagi.');
  }
} 