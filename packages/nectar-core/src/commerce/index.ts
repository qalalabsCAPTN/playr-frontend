export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  compareAtPrice?: number
  inventory: number
  color?: { name: string; hex: string; isWhite?: boolean }
  size?: string
}

export interface Product {
  id: string
  slug: string
  title: string
  description: string
  category: string
  badge?: string
  price: number
  compareAtPrice?: number
  imageSrc: string
  hoverImageSrc?: string
  gallery: string[]
  variants: ProductVariant[]
  colors: Array<{ name: string; hex: string; isWhite?: boolean }>
  sizes: string[]
  specifications: string[]
  materialAndCare: { material: string; care: string }
  loyaltyPoints: number
}

// Mock Data matching the UI files
export const NectarCommerce = {
  getCollection: async (slug: string) => {
    // Return mock products for the collection
    return {
      title: "Premium Polos",
      productCount: 253,
      products: [
        {
          id: "p1",
          title: "playR Men Solid Basico Polo Tshirt",
          price: 799,
          imageSrc: "https://lh3.googleusercontent.com/aida/ADBb0uhrOnWo5Nf4UvFcQKZzq26_ZiPl4eIAW2N_NASKVvrjg3Ei6UT-bmrEHJSZrvpbQnA2gYeySXs7_U2gAmfq9Ozh73c074QN52QvFK6wqBwrYr5JoIIIk7l4ZE4774PNf7cj4QGYfLXKb2gT5piQpzyG9NdHQK64A6abtjp3qlZlGedmdMN-ADTp9e25-T3onhdlTD-oXStgB4LCekcqesknJAwKNaF9LL2MN1M9SsT6mTPlFi-ih8up4Q",
          hoverImageSrc: "https://lh3.googleusercontent.com/aida/ADBb0uhcVgIzrw2pRlI6mCrCuE32GcKKpn9OJ5iislNwsqyrnqo5uUXLmHmUpn28v7bPhTDGMcBOVM2q9y5TLfIvx7LcoHi6w8_Owi3q8FwAWQ_JUWNRq1LYVzB_YSdd5rAJ94hS92bcGIhfyu6zf8cD-b0ryG2_QdzDbi4RI54gvzSaoZITcMDuMkhJ-EfkZyGwKVHCzcLn7OtBm3WA3S1n0bYuv1vRkIG6O6mUEdQOhq2N77Z6XonHutwqtCg",
          colors: [
            { name: "White", hex: "#ffffff", isWhite: true },
            { name: "Grey", hex: "#5c5c5b" }
          ]
        },
        {
          id: "p2",
          title: "Dirk Polo",
          price: 849,
          badge: "BESTSELLER",
          imageSrc: "https://lh3.googleusercontent.com/aida/ADBb0uhXkBHFzmzh3dQDL2VjiH2Vg7QchofifKP1jjv3NA_hkfdQCkfqIRa-kUZwuTsiJdQWos_1NhzzDCg9pRh0iaRzoAGGmkLQyiiqve1CsSmOirB_JTpA6B07KsItWCbOFxyYd6qwXcaTE7kVTnM-EZdVd4FkPNEjSNpZ73wi3RXcD70rg8kFWJC5Fx7l-z9u2SXfptnAI3uT7lLGjxdg-wsYXuXQKztpXVGMhiZo9bMxwCEnBz0v18FOa_M",
          hoverImageSrc: "https://lh3.googleusercontent.com/aida/ADBb0uhAPBLqPGPlccKr-EU65JRpYMEvWGPR5UGz_ZsrokRXV5jz4hFNU5XNRLpCJr1AD-ImX3kcSnBvGDfT6YFJ5-0jmfaNUUdnpfSCitgSyxiIsar3kikjEjCM9wbaOZDJg-cOazynzmVgn-QWCTN0OxR7V3on4gRY58EGILttiVDrnJXQ32GFZzjnfs6n4o500ZjeIWqNw_YDkxNjfWDabMvffIS0rdNIhTWkPlfFGA02DCJcmQu1zylfdBc",
        },
        {
          id: "p3",
          title: "Golfer Polo",
          price: 649,
          compareAtPrice: 1299,
          imageSrc: "https://lh3.googleusercontent.com/aida/ADBb0ujSsqF9vOypHhQr_vRvmlnyoetXrYYPC8a3qmnKF3LQiwNmSiP7NJDyZiFwS47XcoysS71JfyaHIxfFFpifnvj1U7zzaqKwntFYmbMjxiqzkJMics6lX1J3AIeZ7w1sfu18nxksmfmgavSl2fPjxF3LaZWMinIAKixrNsdUK1YCGJxD0sDQ3sIuOE9XFS6gM2GmoOmZpw7Mw_p1cUVEwuyG0SRbDKHRyDXQqRrvsROd3aHm_NjQ-_W9-Xs",
          hoverImageSrc: "https://lh3.googleusercontent.com/aida/ADBb0ujSsqF9vOypHhQr_vRvmlnyoetXrYYPC8a3qmnKF3LQiwNmSiP7NJDyZiFwS47XcoysS71JfyaHIxfFFpifnvj1U7zzaqKwntFYmbMjxiqzkJMics6lX1J3AIeZ7w1sfu18nxksmfmgavSl2fPjxF3LaZWMinIAKixrNsdUK1YCGJxD0sDQ3sIuOE9XFS6gM2GmoOmZpw7Mw_p1cUVEwuyG0SRbDKHRyDXQqRrvsROd3aHm_NjQ-_W9-Xs"
        },
        {
          id: "p4",
          title: "Club Polo",
          price: 799,
          imageSrc: "https://lh3.googleusercontent.com/aida/ADBb0uiSpVvmEEBPcLHm0biMOgC8AGzyVPrBrPT4y-u-lkxRG5ZhzVxrcvViJdv7lhnXasoULdik8M58bkhrLgYiBREDSa6EZR_6skRPc_MUcx3hOu3AjR6HGv73Ewe25HneSpCfTrRf4-2blbbeleb4jDJQVdIPmvkkBHTHTkcQKjhy62JE0h128G6DGHzQ-7j1x5PGn8_ZNkfdKnMJY6smAl83N7bjU40X2rCCd7n8_0QMWDccs2ZIIw2yIXI",
          hoverImageSrc: "https://lh3.googleusercontent.com/aida/ADBb0uiT4bPux5iImWBEHVowEqLPhIddHidTRiki2SgmF1eMIjk3WY-mhjf9KQaCvW66YUGzKr5beniyx5IF-cn-vJ9Tm7HnwOsia3Wvqfag0Ixef-VtdqG6Xcwx3AQ6eiIV0XgedcC1QAtzkvGeb6NmT93Ekzceanz56V-V6352v4rvNvgyCEojpgD650phM1FAmONdGc7pbWS9TY1034JzYGj9GH3ytyNFaeDfbaQ9orIQa9M2zb7IjsZ_pQQ"
        },
        {
          id: "p5",
          title: "Method Polo",
          price: 599,
          imageSrc: "https://lh3.googleusercontent.com/aida/ADBb0uj7USYJna3mpeAJyOB2NSIv75J_HwKOj-G8HECzuEeb6Y0k3PRN4H3svb8PdRg_zz3_49_DYQZmv9DMo_aezYzOTUuPyonjvNmmGwX6t0BPv9xW6UDQCUJeibE541Nuy_xSbTHpUBZIbBmFAQKXpMPB25rAzjDtoMaoei9SAJuGCwv0gyfTdO2TcWjxkvy5zEhr70Hob5rv-5VhcRtiBwL1PAwlLIA_AjObNs9GK-xnRBiLcVUpp8vVd-8",
          hoverImageSrc: "https://lh3.googleusercontent.com/aida/ADBb0uj7USYJna3mpeAJyOB2NSIv75J_HwKOj-G8HECzuEeb6Y0k3PRN4H3svb8PdRg_zz3_49_DYQZmv9DMo_aezYzOTUuPyonjvNmmGwX6t0BPv9xW6UDQCUJeibE541Nuy_xSbTHpUBZIbBmFAQKXpMPB25rAzjDtoMaoei9SAJuGCwv0gyfTdO2TcWjxkvy5zEhr70Hob5rv-5VhcRtiBwL1PAwlLIA_AjObNs9GK-xnRBiLcVUpp8vVd-8"
        },
        {
          id: "p6",
          title: "Mario Polo",
          price: 649,
          imageSrc: "https://lh3.googleusercontent.com/aida/ADBb0ug5hr_RtQDn0qkK0-Lw9rVCi_xCNfqjBHnnR29vl4JkFDigvGMTLYX20Ms9LtO3lcjeUclARGv-ot_kRzkbGqWO3d0dVqhlMRIPKsaCtIRLBb3_s7YYOwPAQhPyW-tx1nNSAv_rTAqfVosL3I2n3jYnLRLxTGOq9TNsjWi7FrpaL9-4k7UDykOywL83W_4XeSq8n7X9SSk7ZhHKoF0caMiCszpluIvCJbkw3fV_UAnZ6Ibwyp0oNr2zYw",
          hoverImageSrc: "https://lh3.googleusercontent.com/aida/ADBb0ug5hr_RtQDn0qkK0-Lw9rVCi_xCNfqjBHnnR29vl4JkFDigvGMTLYX20Ms9LtO3lcjeUclARGv-ot_kRzkbGqWO3d0dVqhlMRIPKsaCtIRLBb3_s7YYOwPAQhPyW-tx1nNSAv_rTAqfVosL3I2n3jYnLRLxTGOq9TNsjWi7FrpaL9-4k7UDykOywL83W_4XeSq8n7X9SSk7ZhHKoF0caMiCszpluIvCJbkw3fV_UAnZ6Ibwyp0oNr2zYw"
        },
        {
          id: "p7",
          title: "Mark Polo",
          price: 799,
          imageSrc: "https://lh3.googleusercontent.com/aida/ADBb0ugEVUMJGL4yD4_7ljmXxSS0YaEvjW1PK2ANAN_I8e3t6mjD7k4_Yn3NnJz4-nosB9JhQ7HFUIybpK73pSX_YKT_2dEMZqlFpz6E10hvDWJJ9uHzpFw-F8IjZiZqmXYmhDDNvAaKqeKQ1amGQkie3AtQpq2viZUOcPluXclBxusZP0MQ1ruWghbSe_usDey0eCRr32LRkXy6BvvN73VGrUv_g48K4y6sfLwubNGm60MP3hYmTnSALDP13Q",
          hoverImageSrc: "https://lh3.googleusercontent.com/aida/ADBb0ugEVUMJGL4yD4_7ljmXxSS0YaEvjW1PK2ANAN_I8e3t6mjD7k4_Yn3NnJz4-nosB9JhQ7HFUIybpK73pSX_YKT_2dEMZqlFpz6E10hvDWJJ9uHzpFw-F8IjZiZqmXYmhDDNvAaKqeKQ1amGQkie3AtQpq2viZUOcPluXclBxusZP0MQ1ruWghbSe_usDey0eCRr32LRkXy6BvvN73VGrUv_g48K4y6sfLwubNGm60MP3hYmTnSALDP13Q"
        },
        {
          id: "p8",
          title: "Court Polo",
          price: 749,
          imageSrc: "https://lh3.googleusercontent.com/aida/ADBb0ugyPyu6bwLpkIoCJ8786y5LeOr8jmPi8ZGM7FphMB7fx7SrVHmFT7kVyuhALVG1J0CFEYLxQsRh9sFKccoMxrn-TVQGcYl1VAv-WWzJwvOmeLpmJhtswPtu5TJeO9H7qFbP2uXtr9PgxXQ2lTdGds3TsiP7vchLTfVQhij7qxJtYuRpBN_cHihjfGlGY0XOivB9O0t25IUu5QAGzWki4LvfDiAsHwj3Huj4cwVeub6LzdH2ZITMWEJed6o",
          hoverImageSrc: "https://lh3.googleusercontent.com/aida/ADBb0ugyPyu6bwLpkIoCJ8786y5LeOr8jmPi8ZGM7FphMB7fx7SrVHmFT7kVyuhALVG1J0CFEYLxQsRh9sFKccoMxrn-TVQGcYl1VAv-WWzJwvOmeLpmJhtswPtu5TJeO9H7qFbP2uXtr9PgxXQ2lTdGds3TsiP7vchLTfVQhij7qxJtYuRpBN_cHihjfGlGY0XOivB9O0t25IUu5QAGzWki4LvfDiAsHwj3Huj4cwVeub6LzdH2ZITMWEJed6o"
        }
      ]
    }
  },
  getProduct: async (slug: string): Promise<Product> => {
    // Return mock product matching the PDP UI
    return {
      id: "prod-accu-run",
      slug: "accu-run-lower",
      title: "playR Accu-Run Lower",
      category: "Performance Gear",
      badge: "45% OFF",
      price: 1299,
      compareAtPrice: 2299,
      description: "The playR Accu Run Lower is designed for ultimate comfort and performance. Made with FLEXVENT. Ideal for workouts, casual wear, or athletic activities, these track pants offer a perfect fit and excellent flexibility.",
      imageSrc: "https://lh3.googleusercontent.com/aida/ADBb0uhZBKfeOuNf6qYsHrfneX0HQYp-RuShVO9vmWDa88e_EHblHdh5IGfQzGH1S4-vnZgqco1qFadqQmkkshydfrrLoIXYLBOzRPtwz7qw3vR2J8X9OC6u5_eLev6qd-IISk89jNhBj1PmxQgRupFDO7YlphdnYXoAykx_pNSSo0K8OQy5-51An_27pjw6kW1Pd6MJa3-vFvFWFpG7wFHkiJ20DTtLDyX12z8CwDBxQ2WF1H5WkGyXHFiJEow",
      gallery: [
        "https://lh3.googleusercontent.com/aida/ADBb0uhZBKfeOuNf6qYsHrfneX0HQYp-RuShVO9vmWDa88e_EHblHdh5IGfQzGH1S4-vnZgqco1qFadqQmkkshydfrrLoIXYLBOzRPtwz7qw3vR2J8X9OC6u5_eLev6qd-IISk89jNhBj1PmxQgRupFDO7YlphdnYXoAykx_pNSSo0K8OQy5-51An_27pjw6kW1Pd6MJa3-vFvFWFpG7wFHkiJ20DTtLDyX12z8CwDBxQ2WF1H5WkGyXHFiJEow",
        "https://lh3.googleusercontent.com/aida/ADBb0uiaZFPVo_ZiWsGWWcBMXvkzHLV_02lv1yx29AqzYlm3qXyua6D9lIthvPgv2OHoSBdaEqIH8JLzPlAZBqwkFJdXN3W_lw16wBZ0qPTipMahfMQrMoxbb4ZSWDs9_xlZStvxYREkKScQGwgpGcWwaz_kle1qwFoK0NRLCgaofFp-zXjOmpdoN8mWI2zCDryp7jw9u9k73YAYC2G2boNNNKmHyys4dzFpIKX5dKmpbQ4g7kIUgvbsjJ4JX1M",
        "https://lh3.googleusercontent.com/aida/ADBb0ui1t_WuH7V_R4R6zfGbJvIVEFWyooy4xm0EdLmZ6rxfpEznO5FcfqO0nnKGNdEUwugMTY_R5MC9-T5G9QHelmD3tXgFjlXi6f-rWc14PFZ1rCOwcr0jNcUwFsF2anWUh1RY0XiPjcqOSFoXCuH6b2YuHR7UZ1_mqEdTfHamtCWvMoUEoQWRL7jRayAqAD5yPdAYetoRhHYe9-C8Rp3mQO4HDtWxt1oQ8nS-IEeP7_I9MkZvbhjko8LZMT0",
        "https://lh3.googleusercontent.com/aida/ADBb0ug9r3E2vpyIWXEoKJ_GLAfo4vHYn2Sp6k1rYmucsyui87TktFiQ811rLz9eHfpDC2m7Z1i0z0yK2V8HpveTjlVDN8ipmYSML-wewZP7OChXi3Nl24aBl3k92ItQnOQGfV25pkbvezhKlV9VniqZVJlbejRdLuzjO04G_S5jv56Rfa5VD-bkwhzXg7Y9R5ESTXs7J98ujui6MKPmEmU1HV9bZklNfbP980Ae636EZGoqRjcsuUpNMT3mFw"
      ],
      colors: [
        { name: "Blue Melange", hex: "#4A6D8C" },
        { name: "Grey", hex: "#808080" },
        { name: "Black", hex: "#1A1A1A" }
      ],
      sizes: ["S", "M", "L", "XL", "2XL"],
      specifications: [
        "FLEXVENT", "Sweat-Release", "Breathable", "Moisture Wicking", "Micro-Fiber", "Anti-Static", "Quick Dry", "Skin Friendly"
      ],
      materialAndCare: {
        material: "92% Polyester, 8% Spandex",
        care: "Machine wash cold, tumble dry low, do not iron on print."
      },
      loyaltyPoints: 130,
      variants: [
        {
          id: "v1",
          name: "Blue Melange / S",
          sku: "PSL22-130-2-S",
          price: 1299,
          inventory: 2,
        }
      ]
    }
  }
}
