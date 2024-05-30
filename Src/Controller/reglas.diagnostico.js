import { getPacienteByIdDiagnostico } from './user.controller.js';
import { getSignosVitalesIdDiagnostico } from './signos_vitales.controller.js';
import Paciente from "../Model/user.model.js";


const enfermedades = [
    {
        nombre: 'Resfriado común',
        sintomas: ['tos', 'fiebre', 'fatiga', 'dolor de cabeza', 'congestión nasal'],
        signosVitales: {
            temperatura: ['normal' , 'elevado'],
            pulso: ['normal'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Gripe',
        sintomas: ['fiebre alta', 'tos', 'dolor de cabeza', 'dolores musculares', 'fatiga'],
        signosVitales: {
            temperatura: ['elevado'],
            pulso: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'COVID-19',
        sintomas: ['fiebre', 'tos', 'fatiga', 'dificultad para respirar', 'pérdida de olfato y gusto'],
        signosVitales: {
            temperatura: ['elevado'],
            pulso: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Neumonía',
        sintomas: ['fiebre', 'tos', 'dolor en el pecho', 'dificultad para respirar', 'fatiga'],
        signosVitales: {
            temperatura: ['elevado'],
            pulso: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Bronquitis',
        sintomas: ['tos persistente', 'flema', 'fatiga', 'dolor en el pecho'],
        signosVitales: {
            temperatura: ['normal o elevado'],
            pulso: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Asma',
        sintomas: ['tos', 'sibilancias', 'dificultad para respirar', 'opresión en el pecho'],
        signosVitales: {
            pulso: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Tuberculosis',
        sintomas: ['tos persistente', 'fiebre', 'sudores nocturnos', 'pérdida de peso', 'fatiga'],
        signosVitales: {
            temperatura: ['normal o elevado'],
            pulso: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Amigdalitis',
        sintomas: ['dolor de garganta', 'fiebre', 'dificultad para tragar', 'dolor de cabeza'],
        signosVitales: {
            temperatura: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Sinusitis',
        sintomas: ['dolor facial', 'congestión nasal', 'dolor de cabeza', 'fiebre'],
        signosVitales: {
            temperatura: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Otitis media',
        sintomas: ['dolor de oído', 'fiebre', 'pérdida de audición'],
        signosVitales: {
            temperatura: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Enfermedad pulmonar obstructiva crónica (EPOC)',
        sintomas: ['tos persistente', 'dificultad para respirar', 'flema', 'fatiga'],
        signosVitales: {
            pulso: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Enfisema',
        sintomas: ['dificultad para respirar', 'tos persistente', 'pérdida de peso'],
        signosVitales: {
            pulso: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Laringitis',
        sintomas: ['ronquera', 'pérdida de voz', 'dolor de garganta', 'tos'],
        signosVitales: {
            temperatura: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Cáncer de pulmón',
        sintomas: ['tos persistente', 'dolor en el pecho', 'pérdida de peso', 'fatiga'],
        signosVitales: {
            temperatura: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Cáncer de laringe',
        sintomas: ['ronquera', 'dificultad para tragar', 'dolor de garganta'],
        signosVitales: {
            temperatura: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Silicosis',
        sintomas: ['tos', 'dificultad para respirar', 'fatiga'],
        signosVitales: {
            temperatura: ['normal o elevado'],
            pulso: ['normal'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Neumotórax',
        sintomas: ['dolor en el pecho', 'dificultad para respirar', 'tos'],
        signosVitales: {
            pulso: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Embolia pulmonar',
        sintomas: ['dolor en el pecho', 'dificultad para respirar', 'tos', 'hinchazón en las piernas'],
        signosVitales: {
            pulso: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Fiebre del valle',
        sintomas: ['fiebre', 'tos', 'dolor en el pecho', 'fatiga'],
        signosVitales: {
            temperatura: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Fibrosis pulmonar',
        sintomas: ['tos persistente', 'dificultad para respirar', 'fatiga'],
        signosVitales: {
            pulso: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Síndrome de dificultad respiratoria aguda (SDRA)',
        sintomas: ['dificultad para respirar severa', 'tos', 'fatiga'],
        signosVitales: {
            pulso: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Virus sincicial respiratorio (VSR)',
        sintomas: ['fiebre', 'tos', 'dificultad para respirar', 'sibilancias'],
        signosVitales: {
            temperatura: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Pleuresía',
        sintomas: ['dolor en el pecho', 'dificultad para respirar', 'tos'],
        signosVitales: {
            pulso: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Laringomalacia',
        sintomas: ['sibilancias', 'dificultad para respirar', 'ronquidos'],
        signosVitales: {
            pulso: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Enfermedad del legionario',
        sintomas: ['fiebre alta', 'tos', 'dolor en el pecho', 'dificultad para respirar'],
        signosVitales: {
            temperatura: ['elevado'],
            pulso: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Neumonía eosinofílica',
        sintomas: ['fiebre', 'tos', 'dificultad para respirar', 'fatiga'],
        signosVitales: {
            temperatura: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Bronquiolitis',
        sintomas: ['tos', 'sibilancias', 'dificultad para respirar', 'fiebre'],
        signosVitales: {
            temperatura: ['elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Tos ferina',
        sintomas: ['tos severa', 'fatiga', 'fiebre'],
        signosVitales: {
            temperatura: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Pulmón negro',
        sintomas: ['tos persistente', 'dificultad para respirar', 'dolor en el pecho'],
        signosVitales: {
            temperatura: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    },
    {
        nombre: 'Sarcoidosis',
        sintomas: ['tos', 'dificultad para respirar', 'fatiga', 'fiebre'],
        signosVitales: {
            temperatura: ['elevado'],
            pulso: ['normal o elevado'],
            presionArterial: ['normal'],
            peso: ['normal'],
            estatura: ['normal']
        }
    }
];
const diagnosticar = (pacienteData) => {
    for (let enfermedad of enfermedades) {
        const sintomasMatch = enfermedad.sintomas.every(sintoma => pacienteData.sintomas.includes(sintoma));
        const signosVitalesMatch = Object.keys(enfermedad.signosVitales).every(signo => enfermedad.signosVitales[signo].includes(pacienteData[signo]));

        if (sintomasMatch && signosVitalesMatch) {
            return enfermedad.nombre;
        }
    }
    return "Enfermedad no diagnosticada";
};


export const updateDiagnostico = async (req, res) => {

    try {
        const pacienteId = '6658cb16916c58d7d571a161'; // ID fijo para prueba, cambiar según tu implementación

        // Verificar si res está definido
        if (!res) {
            console.error("Response object is undefined");
            return;
        }

        const pacienteSintomas = await getPacienteByIdDiagnostico({ params: { id: pacienteId } });
        const pacienteSignosVitales = await getSignosVitalesIdDiagnostico({ params: { id: pacienteId } });


        const pacienteData = {
            temperatura: pacienteSignosVitales.temperatura,
            pulso: pacienteSignosVitales.pulso,
            presionArterial: pacienteSignosVitales.presionArterial,
            peso: pacienteSignosVitales.peso,
            estatura: pacienteSignosVitales.estatura,
            sintomas: pacienteSintomas.sintomas,
        };
        console.log("Paciente data:", pacienteData);
        // Realizar diagnóstico
        const enfermedadDiagnosticada = diagnosticar(pacienteData);

        console.log("Enfermedad diagnosticada:", enfermedadDiagnosticada);

        // Actualizar diagnóstico del paciente
        const paciente = await Paciente.findByIdAndUpdate(pacienteId, { diagnostico: enfermedadDiagnosticada }, { new: true });

        res.status(200).json({ message: "Diagnóstico actualizado exitosamente" });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: error.message });
    }

};