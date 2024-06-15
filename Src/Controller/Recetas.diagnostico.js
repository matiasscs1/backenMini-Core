import { getPacienteByIdDiagnostico } from './user.controller.js';
import Paciente from "../Model/user.model.js";


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
    const medicamentosPrescritosLower = medicamentosPrescritos.map(m => m.trim().toLowerCase());
    const medicamentosPredefinidosLower = medicamentosPredefinidos.map(m => m.medicamento.toLowerCase());

    let coincidencias = 0;

    medicamentosPrescritosLower.forEach(prescrito => {
        if (medicamentosPredefinidosLower.includes(prescrito)) {
            coincidencias++;
        }
    });

    const porcentajeCoincidencia = (coincidencias / medicamentosPredefinidosLower.length) * 100;
    return porcentajeCoincidencia;
};

// Función para comparar alergias
const compararAlergias = (alergiasPaciente, medicamentosPrescritos) => {
    const alergiasPacienteLower = alergiasPaciente.map(a => a.toLowerCase());
    const medicamentosPrescritosLower = medicamentosPrescritos.map(m => m.trim().toLowerCase());

    let coincidencias = [];

    alergiasPacienteLower.forEach(alergia => {
        if (medicamentosPrescritosLower.includes(alergia)) {
            coincidencias.push(alergia);
        }
    });

    return coincidencias.join(', ');
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
        const medicamentosPrescritos = Array.isArray(medicamentoAtomar) ? medicamentoAtomar.flatMap(m => m.split(',').map(item => item.trim().toLowerCase())) : [];
        const alergiasPaciente = Array.isArray(alergias) ? alergias.map(a => a.trim().toLowerCase()) : [];

        console.log('Diagnóstico:', diagnostico);
        console.log('Medicamentos prescritos:', medicamentosPrescritos);
        console.log('Alergias del paciente:', alergiasPaciente);

        const enfermedad = medicamentos.find(m => m.enfermedad.toLowerCase() === diagnostico.toLowerCase());

        if (!enfermedad) {
            console.log('Diagnóstico no encontrado en la lista de enfermedades');
            return res.status(404).json({ message: "Diagnóstico no encontrado en la lista de enfermedades" });
        }

        console.log('Enfermedad encontrada:', enfermedad);

        const porcentajeCoincidencia = compararMedicamentos(medicamentosPrescritos, enfermedad.receta);
        const alergiasCoincidencias = compararAlergias(alergiasPaciente, medicamentosPrescritos);

        console.log('Porcentaje de coincidencia de medicamentos:', porcentajeCoincidencia);
        console.log('Coincidencias de alergias:', alergiasCoincidencias);

        // Guardar el porcentaje de coincidencia en el modelo del paciente
        paciente.porcentajeCoincidencia = porcentajeCoincidencia;
        await paciente.save();

        if (alergiasCoincidencias) {
            return res.status(500).json({ success: false, message: `Tiene alergias a los siguientes medicamentos: ${alergiasCoincidencias}. Cambiar receta.` });
        }

        return res.status(200).json({
            success: true,
            diagnostico: diagnostico,
            medicamentosPrescritos: medicamentosPrescritos.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
            medicamentosRecomendados: enfermedad.receta.map(m => m.medicamento),
            porcentajeCoincidencia: porcentajeCoincidencia
        });
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

