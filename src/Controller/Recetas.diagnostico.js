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

// Función utilitaria para normalizar strings (elimina duplicación de .trim().toLowerCase())
const normalizeString = (str) => str.trim().toLowerCase();

// Función utilitaria para normalizar arrays de strings
const normalizeStringArray = (arr) => arr.map(normalizeString);

// Función para procesar medicamentos desde el input del paciente
const procesarMedicamentosPaciente = (medicamentoAtomar) => {
    if (!Array.isArray(medicamentoAtomar)) {
        return [];
    }
    
    const medicamentosExpandidos = medicamentoAtomar.flatMap(m => 
        m.split(',').map(item => normalizeString(item))
    );
    
    // Eliminar duplicados usando Set
    return [...new Set(medicamentosExpandidos)];
};

// Función para comparar medicamentos
const compararMedicamentos = (medicamentosPrescritos, medicamentosPredefinidos) => {
    const medicamentosPredefinidosNormalizados = medicamentosPredefinidos.map(m => 
        normalizeString(m.medicamento)
    );

    const coincidencias = medicamentosPrescritos.filter(prescrito => 
        medicamentosPredefinidosNormalizados.includes(prescrito)
    ).length;

    return (coincidencias / medicamentosPredefinidosNormalizados.length) * 100;
};

// Función para comparar alergias
const compararAlergias = (alergiasPaciente, medicamentosPrescritos) => {
    const coincidencias = alergiasPaciente.filter(alergia => 
        medicamentosPrescritos.includes(alergia)
    );

    return coincidencias.join(', ');
};

// Función para capitalizar primera letra
const capitalizarPrimeraLetra = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Función para buscar enfermedad por diagnóstico
const buscarEnfermedadPorDiagnostico = (diagnostico) => {
    return medicamentos.find(m => 
        normalizeString(m.enfermedad) === normalizeString(diagnostico)
    );
};

// Función para crear respuesta de error
const crearRespuestaError = (res, statusCode, message) => {
    return res.status(statusCode).json({ 
        success: false, 
        message 
    });
};

// Función para crear respuesta exitosa
const crearRespuestaExitosa = (res, data) => {
    return res.status(200).json({
        success: true,
        ...data
    });
};

// Método principal
export const recetasDiagnostico = async (req, res) => {
    try {
        const pacienteId = req.params.id;
        const paciente = await getPacienteByIdDiagnostico({ params: { id: pacienteId } });

        if (!paciente) {
            return crearRespuestaError(res, 404, "Paciente no encontrado");
        }

        const { diagnostico, medicamentoAtomar, alergias } = paciente;
        
        // Procesar datos del paciente una sola vez
        const medicamentosPrescritos = procesarMedicamentosPaciente(medicamentoAtomar);
        const alergiasPaciente = Array.isArray(alergias) ? normalizeStringArray(alergias) : [];

        // Logging para debugging
        console.log('Diagnóstico:', diagnostico);
        console.log('Medicamentos prescritos:', medicamentosPrescritos);
        console.log('Alergias del paciente:', alergiasPaciente);

        // Buscar enfermedad
        const enfermedad = buscarEnfermedadPorDiagnostico(diagnostico);

        if (!enfermedad) {
            console.log('Diagnóstico no encontrado en la lista de enfermedades');
            return crearRespuestaError(res, 404, "Diagnóstico no encontrado en la lista de enfermedades");
        }

        console.log('Enfermedad encontrada:', enfermedad);

        // Realizar comparaciones
        const porcentajeCoincidencia = compararMedicamentos(medicamentosPrescritos, enfermedad.receta);
        const alergiasCoincidencias = compararAlergias(alergiasPaciente, medicamentosPrescritos);

        console.log('Porcentaje de coincidencia de medicamentos:', porcentajeCoincidencia);
        console.log('Coincidencias de alergias:', alergiasCoincidencias);

        // Guardar porcentaje en el modelo
        paciente.porcentajeCoincidencia = porcentajeCoincidencia;
        await paciente.save();

        // Verificar alergias
        if (alergiasCoincidencias) {
            return crearRespuestaError(res, 500, 
                `Tiene alergias a los siguientes medicamentos: ${alergiasCoincidencias}. Cambiar receta.`
            );
        }

        // Respuesta exitosa
        return crearRespuestaExitosa(res, {
            diagnostico,
            medicamentosPrescritos: medicamentosPrescritos.map(capitalizarPrimeraLetra),
            medicamentosRecomendados: enfermedad.receta.map(m => m.medicamento),
            porcentajeCoincidencia
        });

    } catch (error) {
        console.log('Error:', error.message);
        return crearRespuestaError(res, 500, error.message);
    }
};