export const especialidadesData = {
    // CLÍNICO-CIRÚRGICA (91 egressos, 106 CRMs)
    "Ginecologia e Obstetrícia": { total: 31, crms: 35, area: "CLÍNICO-CIRÚRGICA" }, // RN19,CE6,PE4,MS2,SP2,PB1,PI1
    "Anestesiologia": { total: 19, crms: 24, area: "CLÍNICO-CIRÚRGICA" },            // RN13,CE4,BA2,PB2,PE2,SP1
    "Ortopedia e Traumatologia": { total: 18, crms: 22, area: "CLÍNICO-CIRÚRGICA" }, // RN9,CE5,PB4,PE3,RJ1
    "Dermatologia": { total: 8, crms: 8, area: "CLÍNICO-CIRÚRGICA" },               // RN4,CE1,PB1,PE1,SP1
    "Oftalmologia": { total: 8, crms: 9, area: "CLÍNICO-CIRÚRGICA" },               // RN3,PE2,SP2,MA1,RS1
    "Otorrinolaringologia": { total: 7, crms: 8, area: "CLÍNICO-CIRÚRGICA" },       // RN5,SP2,PE1

    // ESPECIALIDADES CLÍNICAS (65 egressos, 74 CRMs)
    "Clínica Médica": { total: 22, crms: 26, area: "ESPECIALIDADES CLÍNICAS" },         // RN10,CE8,SP4,PE3,PB1
    "Psiquiatria": { total: 15, crms: 15, area: "ESPECIALIDADES CLÍNICAS" },            // RN8,SP3,CE2,PE1,PR1
    "Cardiologia": { total: 7, crms: 7, area: "ESPECIALIDADES CLÍNICAS" },              // RN3,CE2,PE1,SP1
    "Neurologia": { total: 6, crms: 6, area: "ESPECIALIDADES CLÍNICAS" },               // RN3,CE1,PB1,SP1
    "Endocrinologia e Metabologia": { total: 4, crms: 5, area: "ESPECIALIDADES CLÍNICAS" }, // RN3,PB1,PE1
    "Hematologia e Hemoterapia": { total: 3, crms: 4, area: "ESPECIALIDADES CLÍNICAS" },    // RN2,CE1,PE1
    "Gastroenterologia": { total: 3, crms: 4, area: "ESPECIALIDADES CLÍNICAS" },       // PE2,CE1,RN1
    "Nefrologia": { total: 3, crms: 3, area: "ESPECIALIDADES CLÍNICAS" },              // RN2,CE1
    "Reumatologia": { total: 1, crms: 2, area: "ESPECIALIDADES CLÍNICAS" },            // PB1,PE1
    "Infectologia": { total: 1, crms: 1, area: "ESPECIALIDADES CLÍNICAS" },            // PE1
    "Geriatria": { total: 1, crms: 1, area: "ESPECIALIDADES CLÍNICAS" },

    // CIRURGIA (21 egressos, 28 CRMs)
    "Cirurgia Geral": { total: 6, crms: 8, area: "CIRURGIA" },              // RN4,SP2,CE1,PB1
    "Neurocirurgia": { total: 4, crms: 7, area: "CIRURGIA" },               // RN3,BA2,RJ2
    "Cirurgia Vascular": { total: 5, crms: 5, area: "CIRURGIA" },           // PE2,NY1,RN1,SP1
    "Coloproctologia": { total: 1, crms: 3, area: "CIRURGIA" },             // CE1,PB1,RN1
    "Mastologia": { total: 2, crms: 2, area: "CIRURGIA" },                  // CE1,RN1
    "Cirurgia Pediátrica": { total: 1, crms: 1, area: "CIRURGIA" },         // RN1
    "Cirurgia Cardiovascular": { total: 1, crms: 1, area: "CIRURGIA" },     // PE1
    "Cirurgia de Cabeça e Pescoço": { total: 1, crms: 1, area: "CIRURGIA" }, // SP1

    // PEDIATRIA (22 egressos, 22 CRMs)
    "Pediatria": { total: 9, crms: 9, area: "PEDIATRIA" },                      // RN6,CE2,RJ1
    "Neonatologia": { total: 6, crms: 6, area: "PEDIATRIA" },                   // RN4,CE1,DF1
    "Endocrinologia Pediátrica": { total: 2, crms: 2, area: "PEDIATRIA" },      // CE1,RN1
    "Oncologia Pediátrica": { total: 2, crms: 2, area: "PEDIATRIA" },           // RN2
    "Neurologia Pediátrica": { total: 1, crms: 1, area: "PEDIATRIA" },          // RN1
    "Cardiopediatria": { total: 1, crms: 1, area: "PEDIATRIA" },                // CE1
    "Medicina Intensiva Pediátrica": { total: 1, crms: 1, area: "PEDIATRIA" },  // RN1

    // MFC (25 egressos, 29 CRMs)
    "Medicina de Família e Comunidade": { total: 25, crms: 29, area: "MFC" }, // RN16,CE8,SP3,RS1,SE1

    // OUTRAS (24 egressos, 28 CRMs)
    "Radiologia e Diagnóstico por Imagem": { total: 12, crms: 15, area: "OUTRAS" }, // RN9,SP6
    "Patologia": { total: 4, crms: 5, area: "OUTRAS" },             // CE1,MG1,RJ1,RN1,SP1
    "Medicina Intensiva": { total: 3, crms: 3, area: "OUTRAS" },    // SC1,CE1,SP1
    "Medicina do Trabalho": { total: 2, crms: 2, area: "OUTRAS" },  // PB1,RN1
    "Medicina de Emergência": { total: 2, crms: 2, area: "OUTRAS" }, // RN2
    "Nutrologia": { total: 1, crms: 1, area: "OUTRAS" },            // RN1
    "Perícia Médica": { total: 1, crms: 1, area: "OUTRAS" },
    "Radioterapia": { total: 1, crms: 1, area: "OUTRAS" },
    "Medicina do Tráfego": { total: 1, crms: 1, area: "OUTRAS" },
    "Medicina Paliativa": { total: 1, crms: 1, area: "OUTRAS" }
};

export const categoriaEspecialidadesData = {
    "CLÍNICO-CIRÚRGICA": { total: 91, crms: 106 },  // 35+24+22+9+8+8
    "ESPECIALIDADES CLÍNICAS": { total: 65, crms: 74 }, // 26+15+7+6+5+4+4+3+2+1+1
    "CIRURGIA": { total: 21, crms: 28 },               // 8+7+5+3+2+1+1+1
    "PEDIATRIA": { total: 22, crms: 22 },              // 9+6+2+2+1+1+1
    "MFC": { total: 25, crms: 29 },
    "OUTRAS": { total: 24, crms: 29 }                  // 15+5+3+2+2+1+1+1+1+1 (inclui Péricia, Radioterapia, etc.)
};
