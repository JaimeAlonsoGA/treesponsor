"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface Tree {
  id: number;
  treeName: string;
  treeType: string;
  age: number;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
}

export function TreeList() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    treeType: "all",
    minAge: "",
    maxAge: "",
    search: "",
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchTrees = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("trees")
        .select("*")
        .range(page * 10, (page + 1) * 10 - 1)
        .order("id", { ascending: true });

      if (filters.treeType !== "all") {
        query = query.eq("treeType", filters.treeType);
      }
      if (filters.minAge) {
        query = query.gte("age", parseInt(filters.minAge));
      }
      if (filters.maxAge) {
        query = query.lte("age", parseInt(filters.maxAge));
      }
      if (filters.search) {
        query = query.ilike("treeName", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setTrees((prevTrees) => [...prevTrees, ...(data as Tree[])]);
      setHasMore(data.length === 10);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError("Error fetching trees. Please try again.");
      console.error("Error fetching trees:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    if (inView) {
      fetchTrees();
    }
  }, [inView, fetchTrees]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    setTrees([]);
    setPage(0);
    setHasMore(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input placeholder="Search by tree name" value={filters.search} onChange={(e) => handleFilterChange("search", e.target.value)} />
        <Select value={filters.treeType} onValueChange={(value) => handleFilterChange("treeType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tree Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="oak">Oak</SelectItem>
            <SelectItem value="pine">Pine</SelectItem>
            <SelectItem value="maple">Maple</SelectItem>
            <SelectItem value="birch">Birch</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Min Age" value={filters.minAge} onChange={(e) => handleFilterChange("minAge", e.target.value)} />
        <Input type="number" placeholder="Max Age" value={filters.maxAge} onChange={(e) => handleFilterChange("maxAge", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trees.map((tree) => (
          <Card key={tree.id}>
            <CardHeader>
              <CardTitle>{tree.treeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Type:</strong> {tree.treeType}
              </p>
              <p>
                <strong>Age:</strong> {tree.age} years
              </p>
              <p>
                <strong>Description:</strong> {tree.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading more trees...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {!loading && !hasMore && <p className="text-center mt-4">No more trees to load</p>}

      <div ref={ref} style={{ height: "10px" }}></div>
    </div>
  );
}
