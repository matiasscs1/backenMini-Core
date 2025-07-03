import httpMocks from 'node-mocks-http';
import { recetasDiagnostico } from '../Controller/Recetas.diagnostico.js'; 
import Paciente from '../Model/user.model.js';
import { getPacienteByIdDiagnostico } from '../Controller/user.controller.js';

// Mockear los módulos externos y las funciones/modelos
jest.mock('../Model/user.model.js');
jest.mock('../Controller/user.controller.js');

describe('recetasDiagnostico Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  // --- Test cases for recetasDiagnostico ---

  it('debe retornar 404 si el paciente no es encontrado', async () => {
    req.params.id = 'nonExistentPatientId';
    getPacienteByIdDiagnostico.mockResolvedValueOnce(null);

    await recetasDiagnostico(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ 
      success: false,
      message: 'Paciente no encontrado' 
    });
    expect(getPacienteByIdDiagnostico).toHaveBeenCalledWith({ params: { id: 'nonExistentPatientId' } });
  });

  it('debe retornar 404 si el diagnóstico del paciente no se encuentra en la lista de enfermedades', async () => {
    req.params.id = 'patientId1';
    const mockPaciente = {
      _id: 'patientId1',
      diagnostico: 'EnfermedadRara', // Diagnóstico que no existe en `medicamentos`
      medicamentoAtomar: ['Paracetamol'],
      alergias: [],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ 
      success: false,
      message: 'Diagnóstico no encontrado en la lista de enfermedades' 
    });
    expect(mockPaciente.save).not.toHaveBeenCalled();
  });

  it('debe retornar 500 y un mensaje de error si el paciente tiene alergias a medicamentos prescritos', async () => {
    req.params.id = 'patientId2';
    const mockPaciente = {
      _id: 'patientId2',
      diagnostico: 'Resfriado común',
      medicamentoAtomar: ['Paracetamol', 'Amoxicilina'],
      alergias: ['Amoxicilina'],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ 
      success: false, 
      message: 'Tiene alergias a los siguientes medicamentos: amoxicilina. Cambiar receta.' 
    });
    expect(mockPaciente.save).toHaveBeenCalled();
  });

  it('debe calcular el porcentaje de coincidencia y retornar la receta si no hay alergias', async () => {
    req.params.id = 'patientId3';
    const mockPaciente = {
      _id: 'patientId3',
      diagnostico: 'Gripe',
      medicamentoAtomar: ['Paracetamol', 'Ibuprofeno'],
      alergias: ['Ninguna'],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    // Los medicamentos recomendados para 'Gripe' son: Paracetamol, Ibuprofeno, Oseltamivir (3 en total)
    // Los prescritos son: Paracetamol, Ibuprofeno (2 coincidencias)
    // Porcentaje: (2/3) * 100 = 66.666...
    const expectedPorcentaje = (2 / 3) * 100;

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      diagnostico: 'Gripe',
      medicamentosPrescritos: ['Paracetamol', 'Ibuprofeno'],
      medicamentosRecomendados: ['Paracetamol', 'Ibuprofeno', 'Oseltamivir'],
      porcentajeCoincidencia: expectedPorcentaje
    });
    expect(mockPaciente.save).toHaveBeenCalled();
  });

  it('debe manejar medicamentosAtomar como string y procesarlo correctamente', async () => {
    req.params.id = 'patientId4';
    const mockPaciente = {
      _id: 'patientId4',
      diagnostico: 'Resfriado común',
      medicamentoAtomar: ['Paracetamol, Ibuprofeno'], // Array con string que contiene comas
      alergias: ['Penicilina'],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    // El controlador procesará 'Paracetamol, Ibuprofeno' y lo dividirá en ['paracetamol', 'ibuprofeno']
    // Para Resfriado común, los medicamentos recomendados son: Paracetamol, Ibuprofeno, Pseudoefedrina, Dextrometorfano (4 total)
    // Coincidencias: Paracetamol, Ibuprofeno (2 coincidencias)
    // Porcentaje: (2/4) * 100 = 50
    const expectedPorcentaje = (2 / 4) * 100;

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      diagnostico: 'Resfriado común',
      medicamentosPrescritos: ['Paracetamol', 'Ibuprofeno'],
      medicamentosRecomendados: ['Paracetamol', 'Ibuprofeno', 'Pseudoefedrina', 'Dextrometorfano'],
      porcentajeCoincidencia: expectedPorcentaje
    });
    expect(mockPaciente.save).toHaveBeenCalled();
  });

  it('debe retornar 500 si ocurre un error inesperado', async () => {
    req.params.id = 'patientId5';
    getPacienteByIdDiagnostico.mockRejectedValueOnce(new Error('Database connection error'));

    await recetasDiagnostico(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ 
      success: false, 
      message: 'Database connection error' 
    });
  });

  it('debe manejar medicamentos prescritos vacíos correctamente', async () => {
    req.params.id = 'patientId6';
    const mockPaciente = {
      _id: 'patientId6',
      diagnostico: 'Gripe',
      medicamentoAtomar: [], // Array vacío
      alergias: [],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    // 0% de coincidencia si no se prescribe nada
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      diagnostico: 'Gripe',
      medicamentosPrescritos: [],
      medicamentosRecomendados: ['Paracetamol', 'Ibuprofeno', 'Oseltamivir'],
      porcentajeCoincidencia: 0
    });
    expect(mockPaciente.save).toHaveBeenCalled();
  });

  it('debe funcionar si las alergias del paciente son vacías o nulas', async () => {
    req.params.id = 'patientId7';
    const mockPaciente = {
      _id: 'patientId7',
      diagnostico: 'Resfriado común',
      medicamentoAtomar: ['Paracetamol'],
      alergias: null, // Alergias nulas
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    // Para Resfriado común: 4 medicamentos recomendados, 1 prescrito (Paracetamol) que coincide
    // Porcentaje: (1/4) * 100 = 25
    const expectedPorcentaje = (1 / 4) * 100;

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      diagnostico: 'Resfriado común',
      medicamentosPrescritos: ['Paracetamol'],
      medicamentosRecomendados: ['Paracetamol', 'Ibuprofeno', 'Pseudoefedrina', 'Dextrometorfano'],
      porcentajeCoincidencia: expectedPorcentaje
    });
    expect(mockPaciente.save).toHaveBeenCalled();
  });

  it('debe manejar medicamentosAtomar que no es array correctamente', async () => {
    req.params.id = 'patientId8';
    const mockPaciente = {
      _id: 'patientId8',
      diagnostico: 'Gripe',
      medicamentoAtomar: 'Paracetamol', // No es array, es string directo
      alergias: [],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    // El nuevo controlador maneja esto y devuelve array vacío si no es array
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      diagnostico: 'Gripe',
      medicamentosPrescritos: [],
      medicamentosRecomendados: ['Paracetamol', 'Ibuprofeno', 'Oseltamivir'],
      porcentajeCoincidencia: 0
    });
    expect(mockPaciente.save).toHaveBeenCalled();
  });

  it('debe eliminar medicamentos duplicados correctamente', async () => {
    req.params.id = 'patientId9';
    const mockPaciente = {
      _id: 'patientId9',
      diagnostico: 'Gripe',
      medicamentoAtomar: ['Paracetamol, Paracetamol, Ibuprofeno'], // Duplicados
      alergias: [],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    // El nuevo controlador elimina duplicados, así que solo debe aparecer una vez cada medicamento
    const expectedPorcentaje = (2 / 3) * 100; // 2 coincidencias de 3 recomendados

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      diagnostico: 'Gripe',
      medicamentosPrescritos: ['Paracetamol', 'Ibuprofeno'], // Sin duplicados
      medicamentosRecomendados: ['Paracetamol', 'Ibuprofeno', 'Oseltamivir'],
      porcentajeCoincidencia: expectedPorcentaje
    });
    expect(mockPaciente.save).toHaveBeenCalled();
  });
});