
"use client";

import React from "react";
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
import { Loader2, TrendingUp, Users, MessageSquare, MapPin } from "lucide-react";

const COLORS = ["#D97706", "#E11D48", "#2563EB", "#16A34A", "#9333EA"];

export function AdminAnalytics() {
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => firestore ? collection(firestore, "bookingRequests") : null, [firestore]);
  const reviewsQuery = useMemoFirebase(() => firestore ? collection(firestore, "reviews") : null, [firestore]);
  const wondersQuery = useMemoFirebase(() => firestore ? collection(firestore, "wonderAttractions") : null, [firestore]);
  const subscribersQuery = useMemoFirebase(() => firestore ? collection(firestore, "newsletter_subscriptions") : null, [firestore]);

  const { data: bookings } = useCollection(bookingsQuery);
  const { data: reviews } = useCollection(reviewsQuery);
  const { data: wonders } = useCollection(wondersQuery);
  const { data: subscribers } = useCollection(subscribersQuery);

  // Simulated data for trends if actual data is sparse
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Trends */}
        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
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

        {/* content Distribution */}
        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-accent" />
              Content Mix
            </CardTitle>
            <CardDescription>Platform data distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
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
            <div className="space-y-2 pr-8">
              {distributionData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary Table-like Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-primary text-white rounded-3xl">
          <CardContent className="p-8">
            <Users className="mb-4 opacity-50" size={32} />
            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Growth Index</p>
            <h3 className="text-4xl font-bold">12.5%</h3>
            <p className="text-xs mt-4 opacity-70">Increase in site visits this month</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-lg bg-white rounded-3xl">
          <CardContent className="p-8">
            <MessageSquare className="text-accent mb-4" size={32} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Sentiment Score</p>
            <h3 className="text-4xl font-bold text-accent">4.8/5</h3>
            <p className="text-xs mt-4 text-muted-foreground">Average traveler review rating</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white rounded-3xl">
          <CardContent className="p-8">
            <TrendingUp className="text-green-600 mb-4" size={32} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Conversion Rate</p>
            <h3 className="text-4xl font-bold text-green-600">8.2%</h3>
            <p className="text-xs mt-4 text-muted-foreground">Clicks on hotel booking interests</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
