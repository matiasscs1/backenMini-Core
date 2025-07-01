// Src/test/reglas.diagnostico.test.js

import httpMocks from 'node-mocks-http';
import { updateDiagnostico } from '../Controller/reglas.diagnostico.js';
import Paciente from '../Model/user.model.js';
import { getPacienteByIdDiagnostico } from '../Controller/user.controller.js';
import { getSignosVitalesIdDiagnostico } from '../Controller/signos_vitales.controller.js';

// Mockear los módulos externos y las funciones/modelos
jest.mock('../Model/user.model.js');
jest.mock('../Controller/user.controller.js');
jest.mock('../Controller/signos_vitales.controller.js');

// Suprimir console.log y console.error durante las pruebas
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('updateDiagnostico Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  // --- Test cases for updateDiagnostico ---

  it('debe actualizar el diagnóstico de un paciente correctamente (Gripe)', async () => {
    const pacienteId = 'patientId123';
    req.params.id = pacienteId;

    // Mock del paciente con síntomas
    getPacienteByIdDiagnostico.mockResolvedValueOnce({
      _id: pacienteId,
      sintomas: ['fiebre alta', 'tos', 'dolor de cabeza', 'dolores musculares', 'fatiga'],
    });

    // Mock de los signos vitales del paciente
    getSignosVitalesIdDiagnostico.mockResolvedValueOnce({
      _id: 'signosId123',
      temperatura: 'elevado',
      pulso: 'elevado',
      presionArterial: 'normal',
      peso: 'normal',
      estatura: 'normal',
    });

    // Mock para Paciente.findByIdAndUpdate
    Paciente.findByIdAndUpdate.mockResolvedValueOnce({
      _id: pacienteId,
      diagnostico: 'Gripe',
    });

    await updateDiagnostico(req, res);

    // Verificaciones
    expect(getPacienteByIdDiagnostico).toHaveBeenCalledWith({ params: { id: pacienteId } });
    expect(getSignosVitalesIdDiagnostico).toHaveBeenCalledWith({ params: { id: pacienteId } });
    expect(Paciente.findByIdAndUpdate).toHaveBeenCalledWith(
      pacienteId,
      { diagnostico: 'Gripe' },
      { new: true }
    );
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Diagnóstico actualizado exitosamente' });
  });

  it('debe retornar la primera enfermedad coincidente o "Resfriado común" si no hay fuerte coincidencia', async () => {
    const pacienteId = 'patientIdNoMatch';
    req.params.id = pacienteId;

    getPacienteByIdDiagnostico.mockResolvedValueOnce({
      _id: pacienteId,
      sintomas: ['sintoma raro', 'otro sintoma'],
    });

    getSignosVitalesIdDiagnostico.mockResolvedValueOnce({
      _id: 'signosIdNoMatch',
      temperatura: 'muy bajo',
      pulso: 'muy alto',
      presionArterial: 'anormal',
      peso: 'bajo',
      estatura: 'normal',
    });

    const expectedDiagnosedDisease = "Resfriado común";

    Paciente.findByIdAndUpdate.mockResolvedValueOnce({
      _id: pacienteId,
      diagnostico: expectedDiagnosedDisease,
    });

    await updateDiagnostico(req, res);

    expect(Paciente.findByIdAndUpdate).toHaveBeenCalledWith(
      pacienteId,
      { diagnostico: expectedDiagnosedDisease },
      { new: true }
    );
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Diagnóstico actualizado exitosamente' });
  });

  it('debe retornar 500 si getPacienteByIdDiagnostico falla', async () => {
    const pacienteId = 'patientIdErrorPaciente';
    req.params.id = pacienteId;

    getPacienteByIdDiagnostico.mockRejectedValueOnce(new Error('Error al obtener paciente'));

    await updateDiagnostico(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Error al obtener paciente' });
  });

  it('debe retornar 500 si getSignosVitalesIdDiagnostico falla', async () => {
    const pacienteId = 'patientIdErrorSignos';
    req.params.id = pacienteId;

    getPacienteByIdDiagnostico.mockResolvedValueOnce({ 
      _id: pacienteId, 
      sintomas: [] 
    });
    getSignosVitalesIdDiagnostico.mockRejectedValueOnce(new Error('Error al obtener signos vitales'));

    await updateDiagnostico(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Error al obtener signos vitales' });
  });

  it('debe retornar 500 si Paciente.findByIdAndUpdate falla', async () => {
    const pacienteId = 'patientIdErrorUpdate';
    req.params.id = pacienteId;

    getPacienteByIdDiagnostico.mockResolvedValueOnce({
      _id: pacienteId,
      sintomas: ['tos'],
    });
    getSignosVitalesIdDiagnostico.mockResolvedValueOnce({
      _id: 'signosId',
      temperatura: 'normal',
      pulso: 'normal',
      presionArterial: 'normal',
      peso: 'normal',
      estatura: 'normal',
    });
    Paciente.findByIdAndUpdate.mockRejectedValueOnce(new Error('Error al actualizar DB'));

    await updateDiagnostico(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Error al actualizar DB' });
  });

  // Test adicional para verificar el diagnóstico con síntomas específicos
  it('debe diagnosticar correctamente con síntomas de asma', async () => {
    const pacienteId = 'patientIdAsma';
    req.params.id = pacienteId;

    getPacienteByIdDiagnostico.mockResolvedValueOnce({
      _id: pacienteId,
      sintomas: ['dificultad para respirar', 'sibilancias', 'opresión en el pecho'],
    });

    getSignosVitalesIdDiagnostico.mockResolvedValueOnce({
      _id: 'signosIdAsma',
      temperatura: 'normal',
      pulso: 'elevado',
      presionArterial: 'normal',
      peso: 'normal',
      estatura: 'normal',
    });

    Paciente.findByIdAndUpdate.mockResolvedValueOnce({
      _id: pacienteId,
      diagnostico: 'Asma',
    });

    await updateDiagnostico(req, res);

    expect(Paciente.findByIdAndUpdate).toHaveBeenCalledWith(
      pacienteId,
      { diagnostico: 'Asma' },
      { new: true }
    );
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Diagnóstico actualizado exitosamente' });
  });

  // Test para verificar el manejo de datos vacíos
  it('debe manejar paciente sin síntomas', async () => {
    const pacienteId = 'patientIdEmpty';
    req.params.id = pacienteId;

    getPacienteByIdDiagnostico.mockResolvedValueOnce({
      _id: pacienteId,
      sintomas: [],
    });

    getSignosVitalesIdDiagnostico.mockResolvedValueOnce({
      _id: 'signosIdEmpty',
      temperatura: 'normal',
      pulso: 'normal',
      presionArterial: 'normal',
      peso: 'normal',
      estatura: 'normal',
    });

    Paciente.findByIdAndUpdate.mockResolvedValueOnce({
      _id: pacienteId,
      diagnostico: 'Resfriado común',
    });

    await updateDiagnostico(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Diagnóstico actualizado exitosamente' });
  });
});