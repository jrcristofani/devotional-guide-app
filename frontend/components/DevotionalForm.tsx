import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, BookOpen } from 'lucide-react';
import backend from '~backend/client';
import type { DevotionalPlan } from '~backend/devotional/types';

interface DevotionalFormProps {
  onDevotionalGenerated: (plan: DevotionalPlan) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export function DevotionalForm({ onDevotionalGenerated, isGenerating, setIsGenerating }: DevotionalFormProps) {
  const [passageRef, setPassageRef] = useState('');
  const [passageText, setPassageText] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passageRef.trim() || !passageText.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha a referência e o texto da passagem bíblica.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Step 1: Generate meditation guide
      const meditation = await backend.devotional.generateMeditation({
        passageRef,
        passageText,
      });

      // Step 2: Generate prayer guide
      const meditationInsights = `${meditation.preparation}\n${meditation.lectio}\n${meditation.reflection.join('\n')}`;
      const prayer = await backend.devotional.generatePrayer({
        passageRef,
        passageText,
        meditationInsights,
      });

      // Step 3: Generate study guide
      const study = await backend.devotional.generateStudy({
        passageRef,
        passageText,
      });

      // Step 4: Generate worship guide
      const studyInsights = `${study.insight}\n${study.crossReferences.join('\n')}\n${study.applicationQuestions.join('\n')}`;
      const worship = await backend.devotional.generateWorship({
        passageRef,
        passageText,
        studyInsights,
      });

      // Step 5: Compile devotional
      const devotionalPlan = await backend.devotional.compileDevotional({
        passageRef,
        passageText,
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
    } catch (error) {
      console.error('Error generating devotional:', error);
      toast({
        title: "Erro ao gerar devocional",
        description: "Ocorreu um erro ao criar seu plano devocional. Tente novamente.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Criar Plano Devocional
        </CardTitle>
        <CardDescription>
          Insira uma passagem bíblica para gerar um plano devocional completo com 
          meditação, oração, estudo e adoração.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="passageRef">Referência Bíblica</Label>
            <Input
              id="passageRef"
              placeholder="Ex: João 3:16, Salmos 23:1-6, Romanos 8:28"
              value={passageRef}
              onChange={(e) => setPassageRef(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passageText">Texto da Passagem</Label>
            <Textarea
              id="passageText"
              placeholder="Cole aqui o texto completo da passagem bíblica..."
              value={passageText}
              onChange={(e) => setPassageText(e.target.value)}
              disabled={isGenerating}
              rows={8}
            />
          </div>

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
  );
}
