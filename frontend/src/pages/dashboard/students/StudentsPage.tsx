import { useState } from "react";
import { students } from "../data";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Flame, Star, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function StudentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Daftar Siswa</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {students.length} siswa kelas 12 terdaftar
          </p>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {paginatedStudents.map((s) => (
          <Card key={s.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {s.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.school}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  Lv.{s.level}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Target: {s.targetUniversity}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-1px_2px_0_rgba(0,0,0,0.1)] transition-all"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {s.progress}%
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-xp" />
                  <span>{s.xp} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-streak" />
                  <span>{s.streak} hari</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table view */}
      <Card className="shadow-card overflow-hidden hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Sekolah</TableHead>
                <TableHead>Target PTN</TableHead>
                <TableHead>Progres</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>XP</TableHead>
                <TableHead>Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {s.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.school}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{s.targetUniversity}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-30">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-1px_2px_0_rgba(0,0,0,0.1)] transition-all"
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {s.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Lv.{s.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-xp" />
                      <span className="text-sm">{s.xp}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-streak" />
                      <span className="text-sm">{s.streak} hari</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-2 px-1">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, students.length)}</span> dari <span className="font-medium">{students.length}</span> siswa
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>
          <div className="flex items-center justify-center min-w-8 h-8 text-sm font-medium">
            {currentPage} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="h-8 px-2"
          >
            Berikutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
