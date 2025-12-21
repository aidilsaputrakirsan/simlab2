<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestingRequestApproval extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'testing_request_id',
        'action',
        'approver_id',
        'is_approved',
        'information'
    ];

    public function testRequest()
    {
        return $this->belongsTo(TestingRequest::class, 'testing_request_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function getApprovalStatusLabelAttribute()
    {
        switch ($this->is_approved) {
            case 0:
                return 'rejected';
            case 1:
                return 'approved';
            case 2:
                return 'revision';
            default:
                return 'pending';
        }
    }

    protected static function actionDefinition(): array
    {
        return [
            'request_testing' => [
                'role' => 'pemohon',
                'description' => 'Pemohon mengajukan pengujian',
            ],
            'verified_by_head' => [
                'role' => 'kepala_lab_terpadu',
                'description' => 'Melakukan verifikasi terhadap permohonan pengujian',
            ],
            'verified_by_laboran' => [
                'role' => 'laboran',
                'description' => 'Menerima tugas dari Kepala Laboratorium Terpadu dan selanjutnya melakukan pengecekkan terhadap permohonan pengujian.',
            ],
        ];
    }

    static function approvalFlows()
    {
        return [
            'request_testing',
            'verified_by_head',
            'verified_by_laboran',
        ];
    }

    static function roleApprovalFlows()
    {
        return [
            'kepala_lab_terpadu' => 'verified_by_head',
            'laboran'            => 'verified_by_laboran',
        ];
    }

    public static function getFlow(): array
    {
        $flows = self::approvalFlows();
        $definition = self::actionDefinition();
        return collect($flows)->map(fn($action) => [
            'action' => $action,
            'role' => $definition[$action]['role'],
            'description' => $definition[$action]['description']
        ])->toArray();
    }
}
