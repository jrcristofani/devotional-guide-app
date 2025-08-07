import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MessageCircle, BookOpen, Music } from 'lucide-react';
import type { DevotionalPlan } from '~backend/devotional/types';

interface DevotionalDisplayProps {
  devotionalPlan: DevotionalPlan;
  onStartNew: () => void;
}

export function DevotionalDisplay({ devotionalPlan, onStartNew }: DevotionalDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onStartNew}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Novo Devocional
        </Button>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            {devotionalPlan.title}
          </CardTitle>
          <CardDescription className="text-lg">
            <Badge variant="secondary" className="text-base px-4 py-2">
              {devotionalPlan.passage.reference}
            </Badge>
          </CardDescription>
        </CardHeader>
        {devotionalPlan.passage.text && (
          <CardContent>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed italic">
                "{devotionalPlan.passage.text}"
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-8">
        {/* Meditation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Heart className="h-6 w-6" />
              1. Meditação
            </CardTitle>
            <CardDescription>
              Preparação para o silêncio e leitura contemplativa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Preparação para o Silêncio</h4>
              <p className="text-gray-700">{devotionalPlan.meditation.preparation}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Leitura Contemplativa (Lectio Divina)</h4>
              <p className="text-gray-700">{devotionalPlan.meditation.lectio}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Perguntas para Reflexão</h4>
              <ul className="space-y-2">
                {devotionalPlan.meditation.reflection.map((question, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <MessageCircle className="h-6 w-6" />
              2. Oração
            </CardTitle>
            <CardDescription>
              Conversa transformadora com Deus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Oração Pessoal</h4>
              <p className="text-gray-700">{devotionalPlan.prayer.personal}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Prática de Intercessão</h4>
              <p className="text-gray-700">{devotionalPlan.prayer.intercession}</p>
            </div>
          </CardContent>
        </Card>

        {/* Study Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <BookOpen className="h-6 w-6" />
              3. Estudo
            </CardTitle>
            <CardDescription>
              Aprofundamento na Palavra de Deus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Insight Central</h4>
              <p className="text-gray-700">{devotionalPlan.study.insight}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Referências Cruzadas</h4>
              <div className="flex flex-wrap gap-2">
                {devotionalPlan.study.crossReferences.map((ref, index) => (
                  <Badge key={index} variant="outline">
                    {ref}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Perguntas de Aplicação</h4>
              <ul className="space-y-2">
                {devotionalPlan.study.applicationQuestions.map((question, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Worship Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Music className="h-6 w-6" />
              4. Adoração
            </CardTitle>
            <CardDescription>
              Resposta do coração à verdade de Deus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Chamado à Adoração</h4>
              <p className="text-gray-700">{devotionalPlan.worship.call}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Ato de Celebração e Envio</h4>
              <p className="text-gray-700">{devotionalPlan.worship.celebration}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
