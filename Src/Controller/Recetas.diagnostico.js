
import {getPacienteByIdDiagnostico} from './user.controller.js';

const medicamentos = [
    {
        enfermedad: 'Resfriado común',
        receta: [
            { medicamento: 'Paracetamol' },
            { medicamento: 'Ibuprofeno' },
            { medicamento: 'Pseudoefedrina' },
            { medicamento: 'Dextrometorfano' }
        ]
    },
    {
        enfermedad: 'Gripe',
        receta: [
            { medicamento: 'Paracetamol' },
            { medicamento: 'Ibuprofeno' },
            { medicamento: 'Oseltamivir' }
        ]
    },
    {
        enfermedad: 'COVID-19',
        receta: [
            { medicamento: 'Paracetamol' },
            { medicamento: 'Ibuprofeno' },
            { medicamento: 'Remdesivir' },
            { medicamento: 'Vitamina D' },
            { medicamento: 'Zinc' }
        ]
    },
    {
        enfermedad: 'Neumonía',
        receta: [
            { medicamento: 'Antibióticos' }
        ]
    },
    {
        enfermedad: 'Bronquitis',
        receta: [
            { medicamento: 'Albuterol' },
            { medicamento: 'Acetilcisteína' },
            { medicamento: 'Paracetamol' },
            { medicamento: 'Ibuprofeno' }
        ]
    },
    {
        enfermedad: 'Asma',
        receta: [
            { medicamento: 'Albuterol' },
            { medicamento: 'Beclometasona' },
            { medicamento: 'Montelukast' }
        ]
    },
    {
        enfermedad: 'Tuberculosis',
        receta: [
            { medicamento: 'Isoniazida' },
            { medicamento: 'Rifampicina' },
            { medicamento: 'Pirazinamida' },
            { medicamento: 'Etambutol' }
        ]
    },
    {
        enfermedad: 'Amigdalitis',
        receta: [
            { medicamento: 'Antibióticos' },
            { medicamento: 'Paracetamol' },
            { medicamento: 'Ibuprofeno' }
        ]
    },
    {
        enfermedad: 'Sinusitis',
        receta: [
            { medicamento: 'Antibióticos' },
            { medicamento: 'Mometasona' },
            { medicamento: 'Pseudoefedrina' }
        ]
    },
    {
        enfermedad: 'Otitis media',
        receta: [
            { medicamento: 'Antibióticos' },
            { medicamento: 'Paracetamol' },
            { medicamento: 'Ibuprofeno' }
        ]
    },
    {
        enfermedad: 'EPOC',
        receta: [
            { medicamento: 'Salmeterol' },
            { medicamento: 'Tiotropio' },
            { medicamento: 'Fluticasona' }
        ]
    },
    {
        enfermedad: 'Enfisema',
        receta: [
            { medicamento: 'Albuterol' },
            { medicamento: 'Prednisona' },
            { medicamento: 'Oxigenoterapia' }
        ]
    },
    {
        enfermedad: 'Laringitis',
        receta: [
            { medicamento: 'Paracetamol' },
            { medicamento: 'Ibuprofeno' }
        ]
    },
    {
        enfermedad: 'Cáncer de pulmón',
        receta: [
            { medicamento: 'Tratamiento específico' },
            { medicamento: 'Paracetamol' }
        ]
    },
    {
        enfermedad: 'Silicosis',
        receta: [
            { medicamento: 'Albuterol' },
            { medicamento: 'Prednisona' },
            { medicamento: 'Oxigenoterapia' }
        ]
    },
    {
        enfermedad: 'Embolia pulmonar',
        receta: [
            { medicamento: 'Heparina' },
            { medicamento: 'Warfarina' },
            { medicamento: 'Apixabán' }
        ]
    },
    {
        enfermedad: 'Fibrosis pulmonar',
        receta: [
            { medicamento: 'Pirfenidona' },
            { medicamento: 'Nintedanib' },
            { medicamento: 'Oxigenoterapia' }
        ]
    },
    {
        enfermedad: 'SDRA',
        receta: [
            { medicamento: 'Soporte ventilatorio' },
            { medicamento: 'Antibióticos' }
        ]
    },
    {
        enfermedad: 'Virus sincicial respiratorio (VSR)',
        receta: [
            { medicamento: 'Albuterol' },
            { medicamento: 'Ribavirina' }
        ]
    },
    {
        enfermedad: 'Tos ferina',
        receta: [
            { medicamento: 'Antibióticos' },
            { medicamento: 'Paracetamol' },
            { medicamento: 'Ibuprofeno' }
        ]
    },
    {
        enfermedad: 'Pulmón negro',
        receta: [
            { medicamento: 'Albuterol' },
            { medicamento: 'Prednisona' },
            { medicamento: 'Oxigenoterapia' }
        ]
    },
    {
        enfermedad: 'Sarcoidosis',
        receta: [
            { medicamento: 'Prednisona' },
            { medicamento: 'Metotrexato' }
        ]
    }
];





// Función para comparar medicamentos
const compararMedicamentos = (medicamentosPrescritos, medicamentosPredefinidos) => {
    let coincidencias = 0;

    medicamentosPrescritos.forEach(prescrito => {
        if (medicamentosPredefinidos.some(predefinido => predefinido.medicamento.toLowerCase() === prescrito.toLowerCase())) {
            coincidencias++;
        }
    });

    const porcentajeCoincidencia = (coincidencias / medicamentosPredefinidos.length) * 100;
    return porcentajeCoincidencia;
};

const compararAlergias = (alergiasPreescritas, alergiasPredefinidas) => {
    let coincidencias = [];

    alergiasPreescritas.forEach(preescritas => {
        alergiasPredefinidas.forEach(predefinida => {
            if (preescritas.toLowerCase() === predefinida.medicamento.toLowerCase()) {
                coincidencias.push(preescritas);
            }
        });
    });

    // Convertir el array de coincidencias a una cadena con formato adecuado
    let coincidenciasString = coincidencias.join(', ');

    return coincidenciasString;
};

// Método async para hacer la comparación de la receta del doctor con la recomendada
export const recetasDiagnostico = async (req, res) => {
    try {
        const pacienteId = req.params.id; // ID del paciente desde la URL
        const paciente = await getPacienteByIdDiagnostico({ params: { id: pacienteId } });

        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        const { diagnostico, medicamentoAtomar, alergias } = paciente;
        const medicamentosPrescritos = Array.isArray(medicamentoAtomar) ? medicamentoAtomar.map(m => m.trim().toLowerCase()) : [];
        const alergiasPaciente = Array.isArray(alergias) ? alergias.map(a => a.trim().toLowerCase()) : [];

        const enfermedad = medicamentos.find(m => m.enfermedad.toLowerCase() === diagnostico.toLowerCase());

        if (!enfermedad) {
            return res.status(404).json({ message: "Diagnóstico no encontrado en la lista de enfermedades" });
        }

        const porcentajeCoincidencia = compararMedicamentos(medicamentosPrescritos, enfermedad.receta);
        const compararAlergia = compararAlergias(alergiasPaciente, enfermedad.receta);

        if (compararAlergia !== '') {
            return res.status(500).json({ message: 'Tiene alergias al medicamento, cambiar receta' });
        }

        return res.status(200).json({
            diagnostico: diagnostico,
            medicamentosPrescritos: medicamentosPrescritos.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
            medicamentosRecomendados: enfermedad.receta.map(m => m.medicamento),
            porcentajeCoincidencia: porcentajeCoincidencia
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};