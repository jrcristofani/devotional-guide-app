import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import backend from '~backend/client';
import type { DevotionalPlan } from '~backend/devotional/types';

interface DevotionalFormProps {
  onDevotionalGenerated: (plan: DevotionalPlan) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export function DevotionalForm({ onDevotionalGenerated, isGenerating, setIsGenerating }: DevotionalFormProps) {
  const [passageRef, setPassageRef] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passageRef.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha a referência da passagem bíblica.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setCurrentStep('Iniciando...');

    try {
      // Step 1: Generate meditation guide
      setCurrentStep('Gerando guia de meditação...');
      const meditation = await backend.devotional.generateMeditation({
        passageRef: passageRef.trim(),
      });

      // Step 2: Generate prayer guide
      setCurrentStep('Criando guia de oração...');
      const meditationInsights = `${meditation.preparation}\n${meditation.lectio}\n${meditation.reflection.join('\n')}`;
      const prayer = await backend.devotional.generatePrayer({
        passageRef: passageRef.trim(),
        meditationInsights,
      });

      // Step 3: Generate study guide
      setCurrentStep('Desenvolvendo guia de estudo...');
      const study = await backend.devotional.generateStudy({
        passageRef: passageRef.trim(),
      });

      // Step 4: Generate worship guide
      setCurrentStep('Preparando guia de adoração...');
      const studyInsights = `${study.insight}\n${study.crossReferences.join('\n')}\n${study.applicationQuestions.join('\n')}`;
      const worship = await backend.devotional.generateWorship({
        passageRef: passageRef.trim(),
        studyInsights,
      });

      // Step 5: Compile devotional
      setCurrentStep('Compilando plano devocional...');
      const devotionalPlan = await backend.devotional.compileDevotional({
        passageRef: passageRef.trim(),
        meditation,
        prayer,
        study,
        worship,
      });

      onDevotionalGenerated(devotionalPlan);
      
      toast({
        title: "Devocional criado com sucesso!",
        description: "Seu plano devocional personalizado está pronto.",
      });
    } catch (error: any) {
      console.error('Error generating devotional:', error);
      
      let errorMessage = "Ocorreu um erro ao criar seu plano devocional. Tente novamente.";
      
      // Handle specific error types
      if (error?.message) {
        if (error.message.includes("OpenAI API key not configured")) {
          errorMessage = "Chave da API OpenAI não configurada. Vá para Infrastructure → Secrets e adicione sua chave como 'OpenAIKey'.";
        } else if (error.message.includes("Invalid OpenAI API key")) {
          errorMessage = "Chave da API OpenAI inválida. Verifique se a chave está correta na configuração de secrets.";
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Limite de uso da API atingido. Tente novamente em alguns minutos.";
        } else if (error.message.includes("Network error") || error.message.includes("fetch")) {
          errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
        } else if (error.message.includes("unavailable")) {
          errorMessage = "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
        }
      }
      
      // Handle HTTP status codes
      if (error?.status) {
        switch (error.status) {
          case 401:
            errorMessage = "Erro de autenticação. Verifique a configuração da chave da API OpenAI.";
            break;
          case 429:
            errorMessage = "Muitas requisições. Aguarde alguns minutos antes de tentar novamente.";
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = "Erro interno do servidor. Tente novamente em alguns minutos.";
            break;
        }
      }
      
      toast({
        title: "Erro ao gerar devocional",
        description: errorMessage,
        variant: "destructive",
      });
      setIsGenerating(false);
      setCurrentStep('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Para usar esta aplicação, você precisa configurar sua chave da API OpenAI 
          na aba Infrastructure. Vá para Infrastructure → Secrets e adicione sua chave como "OpenAIKey".
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Criar Plano Devocional
          </CardTitle>
          <CardDescription>
            Insira uma referência bíblica para gerar um plano devocional completo com 
            meditação, oração, estudo e adoração. Você pode usar abreviações como "Sl 23", "Jo 3:16", "1 Co 13", etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="passageRef">Referência Bíblica</Label>
              <Input
                id="passageRef"
                placeholder="Ex: João 3:16, Sl 23:1-6, Rm 8:28, 1 Co 13, Ap 21:4"
                value={passageRef}
                onChange={(e) => setPassageRef(e.target.value)}
                disabled={isGenerating}
              />
              <p className="text-sm text-gray-500">
                Aceita abreviações: Sl = Salmos, Jo = João, Rm = Romanos, 1 Co = 1 Coríntios, etc.
              </p>
            </div>

            {isGenerating && currentStep && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">{currentStep}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Plano Devocional...
                </>
              ) : (
                'Gerar Plano Devocional'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
