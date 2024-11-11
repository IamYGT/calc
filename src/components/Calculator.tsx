import React, { useState, useEffect } from 'react';
import { Moon, Sun, Calculator as CalcIcon } from 'lucide-react';

interface CalculatorProps {
  user: string;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ user, isDarkMode, onThemeToggle }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState<number>(0);
  const [isNewCalculation, setIsNewCalculation] = useState(true);
  const [previewResult, setPreviewResult] = useState('');
  const [currentUnit, setCurrentUnit] = useState<'standard' | 'length' | 'weight' | 'temp'>('standard');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ('0123456789.+-*/()%'.includes(e.key)) {
        handleInput(e.key);
      } else if (e.key === 'Enter') {
        handleEqual();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [equation]);

  const saveToHistory = (equation: string, result: string, category: string = 'standard') => {
    const history = JSON.parse(localStorage.getItem(`${user}_history`) || '[]');
    history.push({
      equation,
      result,
      category,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(`${user}_history`, JSON.stringify(history));
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewCalculation(true);
    setPreviewResult('');
  };

  const handleEqual = () => {
    try {
      const result = eval(equation);
      setDisplay(result.toString());
      saveToHistory(equation, result.toString(), currentUnit);
      setIsNewCalculation(true);
      setPreviewResult('');
    } catch (error) {
      setDisplay('Error');
      setIsNewCalculation(true);
      setPreviewResult('');
    }
  };

  const handleInput = (value: string) => {
    if (isNewCalculation) {
      setDisplay(value);
      setEquation(value);
      setIsNewCalculation(false);
    } else {
      setDisplay(display === '0' ? value : display + value);
      setEquation(equation + value);
    }
    updatePreview(equation + value);
  };

  const updatePreview = (expr: string) => {
    try {
      const result = eval(expr);
      setPreviewResult(result?.toString() || '');
    } catch {
      setPreviewResult('');
    }
  };

  const handleScientific = (func: string) => {
    try {
      const currentValue = parseFloat(display);
      let result;
      switch (func) {
        case 'sin':
          result = Math.sin(currentValue);
          break;
        case 'cos':
          result = Math.cos(currentValue);
          break;
        case 'tan':
          result = Math.tan(currentValue);
          break;
        case 'sqrt':
          result = Math.sqrt(currentValue);
          break;
        case 'log':
          result = Math.log10(currentValue);
          break;
        default:
          return;
      }
      setDisplay(result.toString());
      saveToHistory(`${func}(${currentValue})`, result.toString(), 'scientific');
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleMemory = (operation: string) => {
    const currentValue = parseFloat(display);
    switch (operation) {
      case 'M+':
        setMemory(memory + currentValue);
        break;
      case 'M-':
        setMemory(memory - currentValue);
        break;
      case 'MR':
        setDisplay(memory.toString());
        setEquation(memory.toString());
        break;
      case 'MC':
        setMemory(0);
        break;
    }
  };

  const handleUnitConversion = (value: number, from: string, to: string) => {
    const conversions: Record<string, Record<string, number>> = {
      length: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001
      },
      weight: {
        kg: 1,
        g: 0.001,
        lb: 0.453592,
        oz: 0.0283495
      }
    };

    if (currentUnit === 'temp') {
      // Temperature conversions
      if (from === 'C' && to === 'F') return (value * 9/5) + 32;
      if (from === 'F' && to === 'C') return (value - 32) * 5/9;
      if (from === 'C' && to === 'K') return value + 273.15;
      if (from === 'K' && to === 'C') return value - 273.15;
      return value;
    }

    const category = currentUnit === 'length' ? conversions.length : conversions.weight;
    return value * category[from] / category[to];
  };

  const buttonClasses = (type: string) => {
    const base = "rounded-lg font-semibold text-sm transition-all duration-200 ";
    const darkMode = isDarkMode ? "dark:" : "";
    
    switch (type) {
      case 'number':
        return base + `${darkMode}bg-gray-100 hover:bg-gray-200 text-gray-800`;
      case 'operator':
        return base + `${darkMode}bg-indigo-100 hover:bg-indigo-200 text-indigo-600`;
      case 'memory':
        return base + `${darkMode}bg-purple-100 hover:bg-purple-200 text-purple-600`;
      case 'scientific':
        return base + `${darkMode}bg-blue-100 hover:bg-blue-200 text-blue-600`;
      case 'equal':
        return base + `${darkMode}bg-indigo-600 hover:bg-indigo-700 text-white`;
      default:
        return base + `${darkMode}bg-gray-100 hover:bg-gray-200 text-gray-800`;
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${isDarkMode ? 'dark' : ''}`}>
      <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <CalcIcon className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {currentUnit === 'standard' ? 'Calculator' : `${currentUnit.charAt(0).toUpperCase() + currentUnit.slice(1)} Converter`}
            </span>
          </div>
          <button
            onClick={onThemeToggle}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-right text-sm mb-1 h-6 overflow-hidden ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {equation || '\u00A0'}
          </div>
          <div className={`text-right text-3xl font-bold h-12 overflow-hidden ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {display}
          </div>
          {previewResult && (
            <div className={`text-right text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              = {previewResult}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <select
            className={`col-span-4 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            value={currentUnit}
            onChange={(e) => setCurrentUnit(e.target.value as any)}
          >
            <option value="standard">Standard Calculator</option>
            <option value="length">Length Converter</option>
            <option value="weight">Weight Converter</option>
            <option value="temp">Temperature Converter</option>
          </select>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Memory Functions */}
          <button className={buttonClasses('memory')} onClick={() => handleMemory('MC')}>MC</button>
          <button className={buttonClasses('memory')} onClick={() => handleMemory('MR')}>MR</button>
          <button className={buttonClasses('memory')} onClick={() => handleMemory('M-')}>M-</button>
          <button className={buttonClasses('memory')} onClick={() => handleMemory('M+')}>M+</button>

          {/* Scientific Functions */}
          <button className={buttonClasses('scientific')} onClick={() => handleScientific('sin')}>sin</button>
          <button className={buttonClasses('scientific')} onClick={() => handleScientific('cos')}>cos</button>
          <button className={buttonClasses('scientific')} onClick={() => handleScientific('tan')}>tan</button>
          <button className={buttonClasses('scientific')} onClick={() => handleScientific('sqrt')}>√</button>

          {/* Standard Calculator */}
          <button className={buttonClasses('operator')} onClick={handleClear}>C</button>
          <button className={buttonClasses('operator')} onClick={() => handleInput('(')}>(</button>
          <button className={buttonClasses('operator')} onClick={() => handleInput(')')}>)</button>
          <button className={buttonClasses('operator')} onClick={() => handleInput('/')}>÷</button>

          <button className={buttonClasses('number')} onClick={() => handleInput('7')}>7</button>
          <button className={buttonClasses('number')} onClick={() => handleInput('8')}>8</button>
          <button className={buttonClasses('number')} onClick={() => handleInput('9')}>9</button>
          <button className={buttonClasses('operator')} onClick={() => handleInput('*')}>×</button>

          <button className={buttonClasses('number')} onClick={() => handleInput('4')}>4</button>
          <button className={buttonClasses('number')} onClick={() => handleInput('5')}>5</button>
          <button className={buttonClasses('number')} onClick={() => handleInput('6')}>6</button>
          <button className={buttonClasses('operator')} onClick={() => handleInput('-')}>-</button>

          <button className={buttonClasses('number')} onClick={() => handleInput('1')}>1</button>
          <button className={buttonClasses('number')} onClick={() => handleInput('2')}>2</button>
          <button className={buttonClasses('number')} onClick={() => handleInput('3')}>3</button>
          <button className={buttonClasses('operator')} onClick={() => handleInput('+')}>+</button>

          <button className={buttonClasses('number')} onClick={() => handleInput('0')}>0</button>
          <button className={buttonClasses('number')} onClick={() => handleInput('.')}>.</button>
          <button className={buttonClasses('operator')} onClick={() => handleInput('%')}>%</button>
          <button className={buttonClasses('equal')} onClick={handleEqual}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;