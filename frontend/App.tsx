import { useState } from 'react';
import { DevotionalForm } from './components/DevotionalForm';
import { DevotionalDisplay } from './components/DevotionalDisplay';
import { Footer } from './components/Footer';
import { Toaster } from '@/components/ui/toaster';
import type { DevotionalPlan } from '~backend/devotional/types';

export default function App() {
  const [devotionalPlan, setDevotionalPlan] = useState<DevotionalPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDevotionalGenerated = (plan: DevotionalPlan) => {
    setDevotionalPlan(plan);
    setIsGenerating(false);
  };

  const handleStartNew = () => {
    setDevotionalPlan(null);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Guia Devocional
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transforme sua leitura bíblica em uma jornada completa de meditação, 
              oração, estudo e adoração através de um plano devocional personalizado.
            </p>
          </header>

          <main>
            {!devotionalPlan ? (
              <DevotionalForm 
                onDevotionalGenerated={handleDevotionalGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            ) : (
              <DevotionalDisplay 
                devotionalPlan={devotionalPlan}
                onStartNew={handleStartNew}
              />
            )}
          </main>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
