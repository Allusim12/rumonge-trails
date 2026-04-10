
"use client";

import React, { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, TrendingUp, Users, MessageSquare, MapPin, Sparkles, Smile, Frown } from "lucide-react";
import { analyzeReviewSentiment, type SentimentAnalysisOutput } from "@/ai/flows/sentiment-analysis";

const COLORS = ["#D97706", "#E11D48", "#2563EB", "#16A34A", "#9333EA"];

export function AdminAnalytics() {
  const firestore = useFirestore();
  const [sentiment, setSentiment] = useState<SentimentAnalysisOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const bookingsQuery = useMemoFirebase(() => firestore ? collection(firestore, "bookingRequests") : null, [firestore]);
  const reviewsQuery = useMemoFirebase(() => firestore ? collection(firestore, "reviews") : null, [firestore]);
  const wondersQuery = useMemoFirebase(() => firestore ? collection(firestore, "wonderAttractions") : null, [firestore]);
  const subscribersQuery = useMemoFirebase(() => firestore ? collection(firestore, "newsletter_subscriptions") : null, [firestore]);

  const { data: bookings } = useCollection(bookingsQuery);
  const { data: reviews } = useCollection(reviewsQuery);
  const { data: wonders } = useCollection(wondersQuery);
  const { data: subscribers } = useCollection(subscribersQuery);

  useEffect(() => {
    if (reviews && reviews.length > 0 && !sentiment && !isAnalyzing) {
      setIsAnalyzing(true);
      const comments = reviews.map(r => r.comment).filter(c => !!c);
      analyzeReviewSentiment({ reviews: comments.slice(0, 50) })
        .then(setSentiment)
        .catch(console.error)
        .finally(() => setIsAnalyzing(false));
    }
  }, [reviews, sentiment, isAnalyzing]);

  const chartData = [
    { name: "Mon", bookings: 4, reviews: 2 },
    { name: "Tue", bookings: 3, reviews: 5 },
    { name: "Wed", bookings: 7, reviews: 3 },
    { name: "Thu", bookings: 5, reviews: 8 },
    { name: "Fri", bookings: 9, reviews: 4 },
    { name: "Sat", bookings: 12, reviews: 7 },
    { name: "Sun", bookings: 10, reviews: 6 },
  ];

  const distributionData = [
    { name: "Wonders", value: wonders?.length || 0 },
    { name: "Reviews", value: reviews?.length || 0 },
    { name: "Bookings", value: bookings?.length || 0 },
    { name: "Subscribers", value: subscribers?.length || 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Level Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 border-none shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" />
              Activity Trends
            </CardTitle>
            <CardDescription>Daily volume of platform engagement</CardDescription>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#D97706" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="reviews" stroke="#E11D48" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Sentiment Analysis */}
        <Card className="lg:col-span-4 border-none shadow-xl bg-primary text-white rounded-3xl overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="text-secondary" />
              AI Sentiment
            </CardTitle>
            <CardDescription className="text-white/60">Real-time analysis of visitor reviews</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-6">
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-xs font-bold uppercase animate-pulse">Analyzing Vibe...</p>
              </div>
            ) : sentiment ? (
              <>
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{sentiment.score}%</div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-70">Positivity Score</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl">
                    <Smile size={18} className="text-green-300 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Key Compliment</p>
                      <p className="text-xs leading-relaxed italic">"{sentiment.topCompliments[0]}"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl">
                    <Frown size={18} className="text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Top Concern</p>
                      <p className="text-xs leading-relaxed italic">"{sentiment.topConcerns[0]}"</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center opacity-40 text-sm">Awaiting review data...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* content Distribution */}
        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-accent" />
              Content Mix
            </CardTitle>
            <CardDescription>Platform data distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 pr-4">
              {distributionData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-bold">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground whitespace-nowrap">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Stats */}
        <Card className="border-none shadow-lg bg-accent text-white rounded-3xl flex flex-col justify-center p-8">
           <Users className="mb-4 opacity-50" size={32} />
           <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Community Growth</p>
           <h3 className="text-4xl font-bold">+{subscribers?.length || 0}</h3>
           <p className="text-xs mt-4 opacity-70">New newsletter subscribers this cycle</p>
        </Card>

        <Card className="border-none shadow-lg bg-white rounded-3xl flex flex-col justify-center p-8">
           <MessageSquare className="text-accent mb-4" size={32} />
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Sentiment Score</p>
           <h3 className="text-4xl font-bold text-accent">{sentiment ? (sentiment.score/20).toFixed(1) : '4.5'}/5</h3>
           <p className="text-xs mt-4 text-muted-foreground">AI-calculated satisfaction index</p>
        </Card>
      </div>
    </div>
  );
}
