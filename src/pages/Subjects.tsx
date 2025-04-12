
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Book, 
  ChevronRight, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample subjects data
const subjectsData = [
  {
    id: 1,
    name: "Mathematics",
    icon: "📊",
    description: "Algebra, Geometry, Calculus and Statistics",
    category: "STEM",
    progress: 65,
    lastStudied: "2 days ago",
    chapters: 12,
    completedChapters: 8,
  },
  {
    id: 2,
    name: "Physics",
    icon: "🔭",
    description: "Mechanics, Thermodynamics, and Electromagnetism",
    category: "STEM",
    progress: 40,
    lastStudied: "Yesterday",
    chapters: 14,
    completedChapters: 6,
  },
  {
    id: 3,
    name: "Biology",
    icon: "🧬",
    description: "Cells, Genetics, Evolution, and Ecology",
    category: "STEM",
    progress: 75,
    lastStudied: "Today",
    chapters: 10,
    completedChapters: 7,
  },
  {
    id: 4,
    name: "History",
    icon: "🏛️",
    description: "Ancient Civilizations to Modern World History",
    category: "Humanities",
    progress: 30,
    lastStudied: "3 days ago",
    chapters: 15,
    completedChapters: 5,
  },
  {
    id: 5,
    name: "Literature",
    icon: "📚",
    description: "Poetry, Drama, and Prose Analysis",
    category: "Humanities",
    progress: 50,
    lastStudied: "5 days ago",
    chapters: 8,
    completedChapters: 4,
  },
  {
    id: 6,
    name: "Chemistry",
    icon: "🧪",
    description: "Atoms, Compounds, Reactions, and Stoichiometry",
    category: "STEM",
    progress: 20,
    lastStudied: "1 week ago",
    chapters: 12,
    completedChapters: 2,
  },
];

const Subjects = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addSubjectOpen, setAddSubjectOpen] = useState<boolean>(false);

  // Filter subjects based on search query
  const filteredSubjects = subjectsData.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
          <p className="text-muted-foreground">
            Browse and manage your learning subjects
          </p>
        </div>
        <Button onClick={() => setAddSubjectOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {/* Subject Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Subjects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  All Subjects
                </DropdownMenuItem>
                <DropdownMenuItem>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Not Started
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuItem>
                  STEM
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Humanities
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Languages
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Arts
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Progress (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Progress (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Recently Studied
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-r-none ${view === "grid" ? "bg-secondary" : ""}`}
              onClick={() => setView("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-l-none ${view === "list" ? "bg-secondary" : ""}`}
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Subject List */}
      {filteredSubjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Book className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No subjects found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            We couldn't find any subjects matching your search. Try a different search term or add a new subject.
          </p>
          <Button onClick={() => setAddSubjectOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => (
            <Card key={subject.id} className="education-card">
              <Link to={`/subjects/${subject.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{subject.icon}</div>
                      <CardTitle>{subject.name}</CardTitle>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                      {subject.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {subject.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {subject.completedChapters} of {subject.chapters} chapters
                      </span>
                      <span className="text-muted-foreground">
                        Last studied: {subject.lastStudied}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Continue Learning
                  </Button>
                </CardFooter>
              </Link>
            </Card>
          ))}
          <Card className="education-card bg-secondary border-dashed border-2 hover:border-primary/50">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              <div className="rounded-full bg-primary/10 p-2 mb-2">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Add New Subject</h3>
              <p className="text-sm text-center text-muted-foreground mb-4">
                Customize your learning experience
              </p>
              <Button variant="outline" onClick={() => setAddSubjectOpen(true)}>
                Add Subject
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSubjects.map((subject) => (
            <Link key={subject.id} to={`/subjects/${subject.id}`}>
              <div className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{subject.icon}</div>
                  <div>
                    <h3 className="font-medium">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subject.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{subject.progress}%</div>
                    <div className="text-xs text-muted-foreground">
                      Last studied: {subject.lastStudied}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Subject Dialog */}
      <Dialog open={addSubjectOpen} onOpenChange={setAddSubjectOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Add a new subject to customize your learning experience
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="select">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select Subject</TabsTrigger>
              <TabsTrigger value="custom">Custom Subject</TabsTrigger>
            </TabsList>
            <TabsContent value="select" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stem">STEM</SelectItem>
                    <SelectItem value="humanities">Humanities</SelectItem>
                    <SelectItem value="languages">Languages</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">Elementary</SelectItem>
                    <SelectItem value="middle">Middle School</SelectItem>
                    <SelectItem value="high">High School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="custom" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input id="name" placeholder="Enter subject name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Enter subject description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="📊">📊 Chart</SelectItem>
                    <SelectItem value="🧬">🧬 DNA</SelectItem>
                    <SelectItem value="🔭">🔭 Telescope</SelectItem>
                    <SelectItem value="🧪">🧪 Test Tube</SelectItem>
                    <SelectItem value="📚">📚 Books</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stem">STEM</SelectItem>
                    <SelectItem value="humanities">Humanities</SelectItem>
                    <SelectItem value="languages">Languages</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSubjectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddSubjectOpen(false)}>
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
